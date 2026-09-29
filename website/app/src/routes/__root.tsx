import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo by the marketplace meta API and read at BUILD time — no runtime fetch.
import appMetaJson from "../app-meta.json";
import { CartProvider } from "@/site/cart";
import { CartDrawer } from "@/site/ui/CartDrawer";
import { Footer } from "@/site/ui/Footer";
import { Header } from "@/site/ui/Header";
import { JsonLd } from "@/site/ui/JsonLd";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLOR } from "@/site/seo";

declare const __HF_DESIGN_INSPECTOR__: boolean;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  // Read by the platform (marketplace feed card), never rendered here.
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some((zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`));
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function absolute(url: string | null): string | null {
  if (!url) return null;
  return url.startsWith("/") ? `${SITE_URL}${url}` : url;
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? SITE_NAME;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = absolute(toOwnAssetUrl(meta.og_image_url));
  const favicon = toOwnAssetUrl(meta.favicon_url) ?? "/favicon.svg";
  const ogVideo = absolute(toOwnAssetUrl(meta.og_video_url));

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: THEME_COLOR },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baskervville:ital,wght@0,400;1,400&family=Inter:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: favicon, type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function NotFoundComponent() {
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-[1440px] flex-col items-start justify-center gap-6 px-4 py-24 md:px-8">
      <p className="pk-micro text-slate-ink">Error 404 // Stumped</p>
      <h1 className="pk-display max-w-[12ch]">This page has left the field.</h1>
      <p className="max-w-md text-slate-ink">The link may be old, or the page never existed. The catalogue, however, is exactly where we left it.</p>
      <Link to="/shop" className="pk-button-type pk-link pb-1">
        Back to the catalogue →
      </Link>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error instanceof Error ? error : new Error(String(error)), { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-[1440px] flex-col items-start justify-center gap-6 px-4 py-24 md:px-8">
      <p className="pk-micro text-stamp">Rain stopped play</p>
      <h1 className="pk-h1 max-w-[16ch]">This page did not load.</h1>
      <p className="max-w-md text-slate-ink">Something went wrong on our side. Your bag is saved.</p>
      <div className="flex flex-wrap gap-6">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="pk-button-type pk-link pb-1"
        >
          Try again
        </button>
        <a href="/" className="pk-button-type pk-link pb-1">
          Go home
        </a>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PICKLE",
  legalName: "Pickle Clothing",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description: DEFAULT_DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body className="bg-chalk text-navy">
        {children}
        <JsonLd data={organization} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(error instanceof Error ? error : new Error("Failed to load design inspector"), {
          boundary: "higgsfield_design_inspector_import",
        });
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </QueryClientProvider>
  );
}
