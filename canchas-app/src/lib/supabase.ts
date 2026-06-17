import { createClient } from "@supabase/supabase-js";

// La publishable key es pública (viaja en el bundle del navegador), así que
// se puede dejar como fallback para que el build de Vercel funcione aunque
// no estén cargadas las env vars. Para producción seria, definí las env vars
// en Vercel → Settings → Environment Variables.
const FALLBACK_URL = "https://emmqrzqxlkqvsqbihwdt.supabase.co";
const FALLBACK_KEY = "sb_publishable_viHL4H6Hdsc6IZtqebOAxg_N5N__3fA";

const url = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_URL;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_KEY;

// Toda la app vive en el schema `canchas` (separado de StatzPro en el mismo proyecto v9-9)
export const supabase = createClient(url, key, {
  db: { schema: "canchas" },
  auth: { persistSession: true, autoRefreshToken: true },
});
