import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);

export type Review = {
  id: string;
  product_slug: string;
  author: string;
  city: string | null;
  rating: number;
  title: string | null;
  body: string;
  size_bought: string | null;
  is_sample: boolean;
  created_at: string;
};
