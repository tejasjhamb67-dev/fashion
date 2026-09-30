import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default async function Success({ searchParams }: PageProps<"/checkout/success">) {
  const { no } = await searchParams;
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-4 pb-24 pt-32 text-center">
      <p className="label text-muted">Order {typeof no === "string" ? no : "received"}</p>
      <h1 className="display mt-6 text-[56px] md:text-[96px]">
        Welcome to <em>the club.</em>
      </h1>
      <p className="mt-6 max-w-md text-[16px] text-ink/75">
        Your order is in. We&apos;ll email a secure payment link to confirm it, then dispatch within two working days.
      </p>
      <Link href="/shop" className="label mt-10 rounded-full bg-ink px-7 py-4 text-paper transition-colors hover:bg-forest">
        Keep browsing
      </Link>
    </section>
  );
}
