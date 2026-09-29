import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export type Crumb = { label: string; to?: string; search?: Record<string, string> };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="pk-micro flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-ink">
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? (
              <li aria-hidden className="text-stone-deep">
                /
              </li>
            ) : null}
            <li>
              {item.to && i < items.length - 1 ? (
                <Link to={item.to as never} search={item.search as never} className="pk-link">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-navy">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
