"""PICKLE Series 01 film: a procedural macro pass across woven Belgian linen.

Everything is synthesised with NumPy + Pillow and encoded with FFmpeg.
One continuous, cut-free camera move: raking late-day light rises out of
darkness across a plain-weave flax, the camera pushes in and drifts until six
rows of cricket-green peak stitching slide into frame.

usage: python3 linen_film.py film  <out.mp4> [W H FPS SECONDS]
       python3 linen_film.py still <out.png> <t> [W H]
"""
import math
import subprocess
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image

RNG = np.random.default_rng(1926)
SW, SH = 4400, 3200  # source texture size (texels)
S = 22.0  # thread pitch in texels
Z = S * 0.35  # texels of height per unit of h

MAPS = {}


def smooth_table(n_rows, n_cols, rng, lo=0.0, hi=1.0):
    return rng.uniform(lo, hi, size=(n_rows, n_cols)).astype(np.float32)


def sample_rows(table, row, pos):
    """Smoothly interpolate table[row, pos] along pos (float)."""
    k = np.floor(pos).astype(np.int64)
    f = (pos - k).astype(np.float32)
    f = f * f * (3 - 2 * f)
    n = table.shape[1]
    a = table[row % table.shape[0], k % n]
    b = table[row % table.shape[0], (k + 1) % n]
    return a + (b - a) * f


def blur(a, r=1):
    out = a.copy()
    for _ in range(r):
        out = (out + np.roll(out, 1, 0) + np.roll(out, -1, 0) + np.roll(out, 1, 1) + np.roll(out, -1, 1)) / 5.0
    return out


def build_maps():
    y, x = np.mgrid[0:SH, 0:SW].astype(np.float32)
    # gentle waviness so the weave is never ruler straight
    wav = smooth_table(1, 64, RNG, -1, 1)
    u = x / S + 0.35 * sample_rows(wav, np.zeros_like(y, dtype=np.int64), y / 180.0)
    v = y / S + 0.35 * sample_rows(wav, np.zeros_like(x, dtype=np.int64), x / 210.0 + 20)
    i = np.floor(u).astype(np.int64)
    j = np.floor(v).astype(np.int64)
    fu = u - i
    fv = v - j

    n_threads = 400
    thick_w = smooth_table(n_threads, 512, RNG, 0.74, 1.0)
    thick_f = smooth_table(n_threads, 512, RNG, 0.74, 1.0)
    slub_w = RNG.uniform(0, 1, (n_threads, 256)).astype(np.float32) ** 7
    slub_f = RNG.uniform(0, 1, (n_threads, 256)).astype(np.float32) ** 7
    tone_w = RNG.normal(0, 0.045, n_threads).astype(np.float32)
    tone_f = RNG.normal(0, 0.045, n_threads).astype(np.float32)
    streak = smooth_table(n_threads, 2048, RNG, -1, 1)

    tw = sample_rows(thick_w, i, v / 3.0) + 0.55 * sample_rows(slub_w, i, v / 7.0)
    tf = sample_rows(thick_f, j, u / 3.0) + 0.55 * sample_rows(slub_f, j, u / 7.0)
    tw = np.clip(tw, 0.45, 1.35)
    tf = np.clip(tf, 0.45, 1.35)

    pw = np.clip(1 - ((fu - 0.5) / (tw / 2)) ** 2, 0, 1) ** 0.65
    pf = np.clip(1 - ((fv - 0.5) / (tf / 2)) ** 2, 0, 1) ** 0.65
    zw = 0.32 * np.cos(np.pi * (v - 0.5 + i))
    zf = -0.32 * np.cos(np.pi * (u - 0.5 + j))
    hw = np.where(pw > 0, zw + 0.62 * pw * tw, -1.4)
    hf = np.where(pf > 0, zf + 0.62 * pf * tf, -1.4)
    warp_top = hw >= hf
    h = np.maximum(hw, hf)

    # fibre streaks along each thread
    sw = sample_rows(streak, i, v * 2.2)
    sf = sample_rows(streak, j + 173, u * 2.2)
    twist_w = np.sin(2 * np.pi * (v * 2.6 + fu * 1.1))
    twist_f = np.sin(2 * np.pi * (u * 2.6 + fv * 1.1))
    fibre = np.where(warp_top, sw + 0.35 * twist_w, sf + 0.35 * twist_f)
    h = h + 0.05 * fibre + 0.035 * blur(RNG.normal(0, 1, h.shape).astype(np.float32), 1)

    folds = np.zeros_like(h)
    for _ in range(4):
        th = RNG.uniform(0, np.pi)
        wl = RNG.uniform(700, 1600)
        ph = RNG.uniform(0, 2 * np.pi)
        folds += RNG.uniform(0.6, 1.3) * np.sin((x * math.cos(th) + y * math.sin(th)) * 2 * np.pi / wl + ph)
    base = np.array([0.84, 0.77, 0.64], np.float32)
    tone = np.where(warp_top, tone_w[i % n_threads], tone_f[j % n_threads]) + 0.05 * fibre
    alb = base[None, None, :] * (1 + tone[..., None])
    gap = h < -1.0
    alb[gap] = np.array([0.20, 0.16, 0.12], np.float32)

    # six rows of running stitch (the Match Cap peak), rotated slightly
    ang = math.radians(-7.0)
    cx, cy = SW * 0.63, SH * 0.66
    xr = (x - cx) * math.cos(ang) + (y - cy) * math.sin(ang)
    yr = -(x - cx) * math.sin(ang) + (y - cy) * math.cos(ang)
    row_gap = 1.55 * S
    stitch_len, stitch_gap, width = 2.3 * S, 0.2 * S, 0.78 * S
    yr = yr - (xr / (SW * 0.9)) ** 2 * 260  # gentle peak curve
    row = np.round(yr / row_gap)
    in_rows = (np.abs(row) <= 2.5) & (xr > -SW * 0.06) & (xr < SW * 0.42)
    ry = yr - row * row_gap
    period = stitch_len + stitch_gap
    along = (xr + row * 0.08 * period) % period
    in_stitch = in_rows & (along < stitch_len) & (np.abs(ry) < width / 2)
    ends = np.clip(np.minimum(along, stitch_len - along) / (0.45 * S), 0, 1)
    prof = np.sqrt(np.clip(1 - (ry / (width / 2)) ** 2, 0, 1)) * ends ** 0.5
    twist = 0.5 + 0.5 * np.sin((along + ry * 1.8) * (2 * np.pi / (0.55 * S)))
    sh = 0.95 + 1.0 * prof + 0.18 * twist
    use = in_stitch & (sh > h)
    h = np.where(use, sh, h)
    thread = np.array([0.075, 0.14, 0.10], np.float32)
    alb[use] = (thread[None, :] * (0.55 + 0.75 * twist[use][:, None] * prof[use][:, None]))
    # needle holes pull the weave down at each stitch end
    hole = in_rows & (np.abs(ry) < width * 0.7) & ((np.abs(along - stitch_len - stitch_gap / 2) < stitch_gap * 0.35))
    h = np.where(hole, h - 0.35, h)

    h = blur(h, 2)  # round the yarn
    micro = h.copy()
    h = h + 3.2 * folds
    gy, gx = np.gradient(h)
    arrays = {
        "h": micro.astype(np.float32),
        "gx": gx.astype(np.float32),
        "gy": gy.astype(np.float32),
        "r": np.ascontiguousarray(alb[..., 0]),
        "g": np.ascontiguousarray(alb[..., 1]),
        "b": np.ascontiguousarray(alb[..., 2]),
    }
    return {k: Image.fromarray(v.astype(np.float32), mode="F") for k, v in arrays.items()}


def ease(t):
    return t * t * (3 - 2 * t)


def camera(t):
    e = ease(t)
    cx = 1700 + (SW * 0.63 - 1700) * e
    cy = 1100 + (SH * 0.66 - 1100) * e
    view_w = 2600 * (1 - e) + 1400 * e  # texels across the frame
    rot = math.radians(-3.5 + 6.0 * e)
    return cx, cy, view_w, rot


def light(t):
    az = math.radians(232 - 22 * t)  # sun swings from low left toward the top
    el = math.radians(6 + 16 * ease(t))
    intensity = 0.28 + 0.72 * ease(min(1.0, t / 0.35))
    return az, el, intensity


def render(args):
    t, W, H = args
    cx, cy, view_w, rot = camera(t)
    scale = view_w / W  # texels per pixel
    c, s = math.cos(rot), math.sin(rot)
    # output (px,py) -> source; PIL affine maps output to input
    a = scale * c
    b = -scale * s
    d = scale * s
    e = scale * c
    cx0 = cx - (a * W / 2 + b * H / 2)
    cy0 = cy - (d * W / 2 + e * H / 2)
    coeffs = (a, b, cx0, d, e, cy0)

    def warp(name):
        im = MAPS[name]
        return np.asarray(im.transform((W, H), Image.AFFINE, coeffs, resample=Image.BICUBIC), dtype=np.float32)

    h = warp("h")
    gx, gy = warp("gx"), warp("gy")
    # rotate gradients into screen space
    sgx = gx * c + gy * s
    sgy = -gx * s + gy * c
    nx, ny, nz = -sgx * Z, -sgy * Z, np.ones_like(h)
    inv = 1 / np.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx * inv, ny * inv, nz * inv

    az, el, inten = light(t)
    lx, ly, lz = math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el)
    lam = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    # cheap cast shadows: march toward the light in screen space
    shadow = np.ones_like(h)
    reach_px = 1.6 * S / scale  # march about one and a half threads toward the sun
    for k in range(1, 9):
        d = reach_px * k / 8
        dx, dy = int(round(lx / math.cos(el) * d)), int(round(ly / math.cos(el) * d))
        if dx == 0 and dy == 0:
            continue
        occ = np.roll(np.roll(h, -dy, 0), -dx, 1)
        # no wrap-around: samples that fell off the frame see no occluder
        if dy > 0:
            occ[-dy:, :] = -9
        elif dy < 0:
            occ[:-dy, :] = -9
        if dx > 0:
            occ[:, -dx:] = -9
        elif dx < 0:
            occ[:, :-dx] = -9
        rise = (occ - h) * Z - d * scale * math.tan(el)
        shadow = np.minimum(shadow, np.clip(1 - rise / (0.25 * Z), 0.15, 1))
    cavity = np.clip(0.55 + 0.9 * (h - blur(h, 3)), 0.25, 1.1)

    alb = np.stack([warp("r"), warp("g"), warp("b")], -1)
    # a pool of low sun that drifts across the cloth as the light rises
    yy0, xx0 = np.mgrid[0:H, 0:W].astype(np.float32)
    px_ = (xx0 / W - 0.5) * math.cos(az) + (yy0 / H - 0.5) * math.sin(az) * (H / W)
    centre = 0.55 - 0.5 * ease(t)
    pool = 0.18 + 0.82 * np.exp(-((px_ + centre) / 0.4) ** 2)
    sun = np.array([1.0, 0.78, 0.55], np.float32) * 2.7 * inten
    amb = np.array([0.07, 0.055, 0.04], np.float32) * 0.8
    spec = np.clip(nz * 0.0 + (nx * lx + ny * ly + nz * lz), 0, 1) ** 18 * 0.25
    lit = alb * (lam * shadow * pool)[..., None] * sun + alb * amb * cavity[..., None] + spec[..., None] * sun * 0.15
    lit *= cavity[..., None] ** 0.5

    # vignette, filmic tone map, warm-forest split grade
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rr = ((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2
    lit *= (1 - 0.42 * np.clip(rr, 0, 1.6) ** 1.2)[..., None]
    x_ = np.maximum(lit - 0.004, 0)
    tm = (x_ * (6.2 * x_ + 0.5)) / (x_ * (6.2 * x_ + 1.7) + 0.06)
    shadows_tint = np.array([0.045, 0.085, 0.065], np.float32)
    tm = tm + shadows_tint * (1 - tm) * 0.45
    grain = np.random.default_rng(int(t * 100000)).normal(0, 0.012, (H, W, 1)).astype(np.float32)
    out = np.clip(tm + grain, 0, 1)
    return (out * 255 + 0.5).astype(np.uint8)


def init_worker():
    pass


def main():
    global MAPS
    mode = sys.argv[1]
    MAPS = build_maps()
    if mode == "still":
        out, t = sys.argv[2], float(sys.argv[3])
        W, H = (int(sys.argv[4]), int(sys.argv[5])) if len(sys.argv) > 5 else (2400, 1600)
        Image.fromarray(render((t, W, H))).save(out)
        return
    out = sys.argv[2]
    W, H, fps, secs = (int(a) for a in sys.argv[3:7]) if len(sys.argv) > 6 else (1920, 1080, 24, 14)
    n = fps * secs
    ff = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
         "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-pix_fmt", "yuv420p", out],
        stdin=subprocess.PIPE,
    )
    with Pool(5) as pool:
        for k, frame in enumerate(pool.imap(render, [(i / (n - 1), W, H) for i in range(n)], chunksize=2)):
            ff.stdin.write(frame.tobytes())
            if k % 24 == 0:
                print("frame", k, flush=True)
    ff.stdin.close()
    ff.wait()
    print("done", out)


if __name__ == "__main__":
    main()
