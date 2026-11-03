import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const rawUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  "";

const rawKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  "";

if (!rawUrl || !rawKey) {
  console.warn(
    "[JagoFarm Notes] Supabase URL atau Anon Key belum terdeteksi di build! Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diset saat 'npm run build'."
  );
}

const supabaseUrl = rawUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = rawKey || "placeholder-anon-key";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SITE_URL as string) ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export function createClient() {
  return supabase;
}

export type UserRole = "admin" | "member";
