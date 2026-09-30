import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 pt-24 text-center">
      <p className="label text-muted">404</p>
      <h1 className="display text-[56px] md:text-[88px]">
        Stumped. <em>This page left early.</em>
      </h1>
      <Link href="/shop" className="label rounded-full bg-ink px-7 py-4 text-paper hover:bg-forest">
        Back to the shop
      </Link>
    </section>
  );
}
