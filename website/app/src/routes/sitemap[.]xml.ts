import { createFileRoute } from "@tanstack/react-router";

import { products } from "@/site/catalog";
import { journal } from "@/site/journal";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const entries: Array<[string, string, string]> = [
          ["/", "weekly", "1.0"],
          ["/shop", "weekly", "0.9"],
          ["/collections", "monthly", "0.7"],
          ["/journal", "weekly", "0.6"],
          ["/about", "monthly", "0.5"],
          ...products.map((p): [string, string, string] => [`/product/${p.slug}`, "weekly", "0.8"]),
          ...journal.map((e): [string, string, string] => [`/journal/${e.slug}`, "monthly", "0.5"]),
        ];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(
            ([path, freq, priority]) =>
              `  <url><loc>${origin}${path === "/" ? "/" : path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`,
          ),
          "</urlset>",
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
