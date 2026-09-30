import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { Swatch } from "./Swatch";

/** Product photo for a colour, or a typographic plate until photography lands. */
export function ProductImage({
  product,
  colour,
  index = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
  className = "",
}: {
  product: Product;
  colour?: string;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const c = colour ?? product.colours[0].name;
  const src = product.images[c]?.[index] ?? Object.values(product.images)[0]?.[index];
  if (src) {
    return (
      <Image src={src} alt={`${product.name} in ${c}`} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
    );
  }
  const hex = product.colours.find((x) => x.name === c)?.hex ?? product.colours[0].hex;
  return (
    <div className={`absolute inset-0 flex flex-col justify-between bg-paper-2 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <span className="label text-muted">{product.no}.</span>
        <Swatch colour={product.colours.find((x) => x.name === c) ?? product.colours[0]} size={10} />
      </div>
      <div className="relative mx-auto aspect-square w-3/5 rounded-full opacity-90" style={{ background: `radial-gradient(circle at 35% 30%, ${hex}, ${hex} 55%, rgb(0 0 0 / 0.25))` }} />
      <div className="label text-muted">Photography arriving</div>
    </div>
  );
}
