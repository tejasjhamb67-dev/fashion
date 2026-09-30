import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";
import { categories, type CategoryId } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop", description: "The PICKLE SS25 collection: tees, polos, linen shirts, shorts, trousers, caps and bags." };

export default async function Shop({ searchParams }: PageProps<"/shop">) {
  const { c } = await searchParams;
  const initial = categories.some((x) => x.id === c) ? (c as CategoryId) : "all";
  return <ShopGrid initial={initial} />;
}
