import { Reveal } from "../Reveal";

export function Intro() {
  return (
    <section className="mx-auto grid max-w-[1600px] gap-10 px-4 py-28 md:grid-cols-12 md:px-8 md:py-40">
      <Reveal className="md:col-span-7">
        <p className="label text-muted">01. The Club</p>
        <h2 className="display mt-6 text-[56px] md:text-[104px]">
          Old references.
          <br />
          <em>New attitude.</em>
        </h2>
      </Reveal>
      <Reveal className="self-end md:col-span-4 md:col-start-9" delay={0.15}>
        <p className="text-[17px] leading-relaxed text-ink/80">
          PICKLE is an athletic club for people who would rather watch. Washed linen, heavy cotton and brass hardware, cut for the heat and made to be worn
          on repeat, from the first coffee to the last light.
        </p>
        <p className="label mt-8 text-muted">A club for long days. Good clothes. Better company.</p>
      </Reveal>
    </section>
  );
}
