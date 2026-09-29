import { createFileRoute, Link } from "@tanstack/react-router";

import { getOrder } from "@/lib/api/store.functions";
import { formatDate, formatPrice, pad } from "@/site/format";
import { pageHead } from "@/site/seo";
import { PcMark } from "@/site/ui/Stamp";

export const Route = createFileRoute("/order/$id")({
  loader: async ({ params }) => {
    if (!/^PKL-[A-Z0-9]{6}$/.test(params.id)) return { order: null };
    const order = await getOrder({ data: { id: params.id } }).catch(() => null);
    return { order };
  },
  head: ({ params }) => pageHead({ title: `Order ${params.id}`, path: `/order/${params.id}`, noindex: true }),
  component: OrderPage,
});

function OrderPage() {
  const { order } = Route.useLoaderData();
  const { id } = Route.useParams();

  if (!order) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-8">
        <p className="pk-micro text-slate-ink">Order {id}</p>
        <h1 className="pk-h1 mt-4">We could not find that order slip.</h1>
        <p className="mt-4 max-w-md text-slate-ink">Check the reference, or head back to the catalogue.</p>
        <Link to="/shop" className="pk-button-type pk-link mt-6 inline-block pb-1">
          Back to the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-16 md:px-8">
      <div className="border border-stone bg-paper">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-stone p-6 md:p-10">
          <div>
            <p className="pk-micro text-slate-ink">Order slip // {order.id}</p>
            <h1 className="pk-h1 mt-4">Thank you, {order.fullName}.</h1>
            <p className="mt-3 max-w-md text-slate-ink">
              Your order is on the register. The desk will contact {order.email} to confirm delivery to {order.city}.
            </p>
          </div>
          <PcMark />
        </div>

        <p className="pk-micro border-b border-stone bg-cream px-6 py-3 text-stamp md:px-10">
          Preview order: no payment has been taken. The desk will contact you before anything ships.
        </p>

        <dl className="pk-micro grid grid-cols-2 border-b border-stone md:grid-cols-4">
          {[
            ["Reference", order.id],
            ["Filed", formatDate(order.createdAt)],
            ["Delivery", order.delivery === "express" ? "Express" : "Standard"],
            ["Status", "Received"],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-stone p-4 last:border-r-0 md:px-6">
              <dt className="text-slate-ink">{k}</dt>
              <dd className="mt-1 text-navy">{v}</dd>
            </div>
          ))}
        </dl>

        <table className="w-full border-collapse">
          <caption className="sr-only">Items ordered</caption>
          <thead>
            <tr className="border-b border-stone">
              <th scope="col" className="pk-micro px-6 py-3 text-left font-normal text-slate-ink md:px-10">
                No.
              </th>
              <th scope="col" className="pk-micro py-3 text-left font-normal text-slate-ink">
                Piece
              </th>
              <th scope="col" className="pk-micro px-6 py-3 text-right font-normal text-slate-ink md:px-10">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line, i) => (
              <tr key={`${line.slug}-${line.colour}-${line.size}`} className="border-b border-stone">
                <td className="pk-micro px-6 py-4 align-top text-slate-ink md:px-10">{pad(i + 1)}</td>
                <td className="py-4">
                  <p className="pk-utility">{line.name}</p>
                  <p className="pk-micro text-slate-ink">
                    {line.colour} / {line.size} / × {pad(line.qty)}
                  </p>
                </td>
                <td className="pk-price px-6 py-4 text-right align-top md:px-10">{formatPrice(line.price * line.qty)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td className="pk-micro py-2 pt-4 text-slate-ink">Subtotal</td>
              <td className="pk-price px-6 pt-4 text-right md:px-10">{formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td />
              <td className="pk-micro py-2 text-slate-ink">Shipping</td>
              <td className="pk-price px-6 text-right md:px-10">{order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping)}</td>
            </tr>
            <tr>
              <td />
              <td className="pk-utility py-4">Total</td>
              <td className="pk-price px-6 py-4 text-right text-base md:px-10">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-10 flex flex-wrap justify-between gap-6">
        <Link to="/shop" className="pk-button-type pk-link pb-1">
          Back to the catalogue →
        </Link>
        <Link to="/journal" className="pk-button-type pk-link pb-1">
          Read the journal →
        </Link>
      </div>
    </div>
  );
}
