import type { ReactNode } from "react";

import type { Product, SpecRow } from "../catalog";

function Rows({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="divide-y divide-stone">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[8.5rem_1fr] gap-4 py-2.5">
          <dt className="pk-micro pt-0.5 text-slate-ink">{row.label}</dt>
          <dd className="text-sm">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ title, children, defaultOpen = true, id }: { title: string; children: ReactNode; defaultOpen?: boolean; id?: string }) {
  return (
    <details open={defaultOpen} id={id} className="group border-t border-stone">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
        <span className="pk-utility shrink-0">{title}</span>
        <span className="h-px flex-1 bg-stone" aria-hidden />
        <span className="pk-micro w-4 text-center text-slate-ink transition-transform duration-[180ms] group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

/** Technical specification accordion: material, silhouette, finishing expanded by default. */
export function SpecSheet({ product }: { product: Product }) {
  return (
    <div className="border-b border-stone">
      <Section title="Material">
        <Rows rows={product.material} />
      </Section>
      <Section title="Silhouette">
        <Rows rows={product.silhouette} />
      </Section>
      <Section title="Finishing">
        <Rows rows={product.finishing} />
      </Section>
      <Section title="Fit and proportions" id="size-guide" defaultOpen={false}>
        <p className="mb-4 text-sm">{product.fitNote}</p>
        {product.measurements ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[20rem] border-collapse text-left">
              <thead>
                <tr>
                  {product.measurements.headers.map((h) => (
                    <th key={h} scope="col" className="pk-micro border-b border-stone py-2 pr-3 font-normal text-slate-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.measurements.rows.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, i) => (
                      <td key={i} className={`pk-price border-b border-stone py-2.5 pr-3 ${i === 0 ? "font-medium" : "font-normal"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pk-micro mt-3 text-slate-ink">Garment measured flat, doubled where relevant. Tolerance ±1 cm.</p>
          </div>
        ) : null}
      </Section>
      <Section title="Care and longevity" defaultOpen={false}>
        <ul className="space-y-2 text-sm">
          {product.care.map((line, i) => (
            <li key={line} className="grid grid-cols-[2rem_1fr]">
              <span className="pk-micro pt-0.5 text-slate-ink">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Shipping and returns" defaultOpen={false}>
        <p className="text-sm">
          Dispatched from Mumbai in 2 working days. Complimentary standard shipping across India on orders over ₹5,000. Free returns within 14 days on
          unworn pieces with tags.
        </p>
      </Section>
    </div>
  );
}
