import { Reveal } from "../Reveal";

const clips = [
  { n: "01", t: "Cut", d: "Pattern pieces cut by hand, one layer at a time.", src: "/media/craft2" },
  { n: "02", t: "Stitched", d: "Flat seams and bar tacks where the wear goes.", src: "/media/craft1" },
  { n: "03", t: "Finished", d: "Garment dyed and washed so it arrives soft.", src: "/media/linen" },
];

export function Craft() {
  return (
    <section className="bg-paper-2">
      <div className="mx-auto max-w-[1600px] px-4 py-28 md:px-8 md:py-40">
        <Reveal className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="label text-muted">06. Made properly</p>
            <h2 className="display mt-4 text-[48px] md:text-[72px]">
              Quiet by default.
              <br />
              <em>Loud in the details.</em>
            </h2>
          </div>
          <p className="self-end text-[17px] leading-relaxed text-ink/80 md:max-w-md md:justify-self-end">
            Brass buckles, mother-of-pearl buttons, a woven P where only you will see it. Everything here is meant to get better with the washing.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {clips.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink">
                <video className="absolute inset-0 h-full w-full object-cover" src={`${c.src}.mp4`} poster={`${c.src}.jpg`} autoPlay muted loop playsInline />
              </div>
              <div className="mt-4 flex gap-4">
                <span className="label pt-1 text-muted">{c.n}.</span>
                <div>
                  <p className="font-serif text-[22px]">{c.t}</p>
                  <p className="mt-1 text-[14px] text-muted">{c.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
