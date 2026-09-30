"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { supabase, type Review } from "@/lib/supabase";

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" className={i <= n ? "fill-ink" : "fill-ink/15"}>
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews({ slug, sizes }: { slug: string; sizes: string[] }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [writing, setWriting] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    supabase
      .from("reviews")
      .select("*")
      .eq("product_slug", slug)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => live && setReviews((data as Review[]) ?? []));
    return () => {
      live = false;
    };
  }, [slug, tick]);

  const avg = reviews && reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mx-auto mt-28 max-w-[1600px] px-4 md:mt-40 md:px-8">
      <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-muted">Members’ notes</p>
          <h2 className="display mt-4 text-[48px] md:text-[64px]">Reviews</h2>
          {reviews && reviews.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <span className="font-serif text-[40px] leading-none">{avg.toFixed(1)}</span>
              <div>
                <Stars n={Math.round(avg)} />
                <p className="text-[13px] text-muted">
                  {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setWriting((w) => !w)}
            className="label mt-8 rounded-full border border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-paper"
          >
            {writing ? "Close" : "Write a review"}
          </button>
        </div>

        <div className="md:col-span-8">
          <AnimatePresence>
            {writing && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <ReviewForm
                  slug={slug}
                  sizes={sizes}
                  onDone={() => {
                    setWriting(false);
                    setTick((t) => t + 1);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {reviews === null ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-[6px] bg-paper-2" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="font-serif text-[22px] italic text-muted">No notes yet. Be the first member to write one.</p>
          ) : (
            <ul>
              {reviews.map((r) => (
                <li key={r.id} className="grid gap-3 border-b border-line py-7 md:grid-cols-[12rem_1fr]">
                  <div>
                    <p className="text-[14px]">{r.author}</p>
                    <p className="text-[13px] text-muted">{[r.city, r.size_bought && `Size ${r.size_bought}`].filter(Boolean).join(" · ")}</p>
                    {r.is_sample && <p className="label mt-2 text-[9px] text-muted">Sample review</p>}
                  </div>
                  <div>
                    <Stars n={r.rating} />
                    {r.title && <p className="mt-2 font-serif text-[21px]">{r.title}</p>}
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({ slug, sizes, onDone }: { slug: string; sizes: string[]; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = String(f.get("body") ?? "").trim();
    if (body.length < 10) return setErr("A few more words, please (10 characters minimum).");
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      product_slug: slug,
      author: String(f.get("author")).trim(),
      city: String(f.get("city") ?? "").trim() || null,
      title: String(f.get("title") ?? "").trim() || null,
      size_bought: String(f.get("size") ?? "") || null,
      body,
      rating,
    });
    setBusy(false);
    if (error) return setErr("That did not save. Please try again.");
    onDone();
  }

  const input = "h-12 w-full border-b border-ink/25 bg-transparent text-[15px] outline-none transition-colors focus:border-ink placeholder:text-muted";
  return (
    <form onSubmit={submit} className="mb-10 grid gap-5 rounded-[6px] bg-paper-2 p-6 md:grid-cols-2 md:p-8">
      <div className="md:col-span-2">
        <span className="label">Your rating</span>
        <div className="mt-3 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button type="button" key={i} onMouseEnter={() => setHover(i)} onClick={() => setRating(i)} aria-label={`${i} stars`}>
              <svg width={26} height={26} viewBox="0 0 20 20" className={i <= (hover || rating) ? "fill-ink" : "fill-ink/15"}>
                <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <input name="author" required maxLength={60} placeholder="Name" className={input} />
      <input name="city" maxLength={60} placeholder="City (optional)" className={input} />
      <input name="title" maxLength={120} placeholder="Headline (optional)" className={input} />
      <select name="size" defaultValue="" className={input}>
        <option value="">Size bought (optional)</option>
        {sizes.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea name="body" required maxLength={2000} rows={4} placeholder="How does it wear?" className={`${input} h-auto py-3 md:col-span-2`} />
      <div className="flex items-center gap-4 md:col-span-2">
        <button disabled={busy} className="label rounded-full bg-ink px-7 py-3.5 text-paper transition-colors hover:bg-forest disabled:opacity-60">
          {busy ? "Posting" : "Post review"}
        </button>
        <p className="text-[13px] text-rust" aria-live="polite">{err}</p>
      </div>
    </form>
  );
}
