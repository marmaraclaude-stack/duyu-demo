"use client";

// Tarayıcı tarafı Supabase istemcisi. Ortam değişkenleri tanımlı değilse
// null döner ve uygulama yerel demo verisiyle çalışmaya devam eder; böylece
// CI derlemesi ve yapılandırmasız önizlemeler kırılmaz.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
