export const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export const SPORT_LABEL: Record<string, string> = {
  futbol_5: "Fútbol 5",
  futbol_7: "Fútbol 7",
  futbol_11: "Fútbol 11",
  padel: "Pádel",
  tenis: "Tenis",
  basquet: "Básquet",
  hockey: "Hockey",
  otro: "Otro",
};

// agrupa cualquier variante de fútbol a la familia visual
export function sportFamily(sport: string): "futbol" | "padel" | "tenis" {
  if (sport.startsWith("futbol")) return "futbol";
  if (sport === "padel") return "padel";
  return "tenis";
}

export function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371, r = Math.PI / 180;
  const x =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(x));
}

export const km = (d: number) => (d < 10 ? d.toFixed(1) : Math.round(d)) + " km";
