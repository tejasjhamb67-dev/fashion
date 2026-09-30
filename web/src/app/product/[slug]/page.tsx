import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/catalog";
import { ProductView } from "@/components/product/ProductView";
import { Reviews } from "@/components/product/Reviews";
import { CompleteTheLook } from "@/components/product/CompleteTheLook";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const img = p.images[p.colours[0].name]?.[0];
  return { title: p.name, description: `${p.line} ${p.description}`, openGraph: img ? { images: [img] } : undefined };
}

export default async function ProductPage({ params, searchParams }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const { colour } = await searchParams;
  const product = getProduct(slug);
  if (!product) notFound();
  const initial = product.colours.find((c) => c.name === colour)?.name ?? product.colours[0].name;
  return (
    <>
      <ProductView product={product} initialColour={initial} />
      <Reviews slug={product.slug} sizes={product.sizes} />
      <CompleteTheLook product={product} />
    </>
  );
}
