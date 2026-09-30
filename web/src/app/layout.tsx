import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pickle-club.vercel.app"),
  title: { default: "PICKLE — Clothes for longer days", template: "%s — PICKLE" },
  description: "PICKLE Athletic Club, Bombay. Caps, tees, linen shirts and shorts for long Indian summers.",
  openGraph: { images: ["/p/og.jpg"], siteName: "PICKLE" },
};

export const viewport: Viewport = { themeColor: "#efeae0" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${inter.variable}`}>
      <body className="grain min-h-dvh">
        <CartProvider>
          <SmoothScroll />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
