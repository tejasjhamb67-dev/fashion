import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function Checkout() {
  return <CheckoutForm />;
}
