import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn("Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env.local");
}

// Toda la app vive en el schema `canchas` (separado de StatzPro en el mismo proyecto v9-9)
export const supabase = createClient(url, key, {
  db: { schema: "canchas" },
  auth: { persistSession: true, autoRefreshToken: true },
});
