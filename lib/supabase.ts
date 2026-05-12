import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — safe to use in browser / Server Components
export const supabase = createClient(supabaseUrl, supabaseAnon);

// Admin client — server-side only (API routes, Server Actions)
export const supabaseAdmin = supabaseServiceRole
  ? createClient(supabaseUrl, supabaseServiceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : supabase;

// ── Types mirroring the DB schema ──────────────────────────────────────────────
export interface DBProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  badge?: string;
  sizes: string[];
  colors: string[];
  image: string;
  in_stock: boolean;
  created_at: string;
}

export interface DBOrder {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_reference?: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

export interface DBBespokeOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  silhouette: string;
  waist_style: string;
  pleat_style: string;
  fabric: string;
  color: string;
  measurements: Record<string, string>;
  timeline: string;
  notes?: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

export interface DBSubscriber {
  id: string;
  email: string;
  first_name?: string;
  subscribed_at: string;
  active: boolean;
}
