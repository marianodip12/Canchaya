import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { ARS, DAYS, haversine, km, sportFamily } from "../../lib/format";
import { useCourts } from "../../hooks/useCourts";
import { useUI } from "../../store/ui";
import { Carousel } from "../../components/Carousel";
import { Stars } from "../../components/Stars";
import { Pin, STAR } from "../../components/icons";
import { MapModal } from "../../components/MapModal";
import { BookingBar } from "../../components/BookingBar";
import type { CourtCard } from "../../types/db";

const FILTERS = ["Todas", "Fútbol 5", "Fútbol 7", "Pádel", "Tenis"] as const;
const FILTER_SPORT: Record<string, string | null> = {
  "Todas": null, "Fútbol 5": "futbol_5", "Fútbol 7": "futbol_7", "Pádel": "padel", "Tenis": "tenis",
};
const RATINGS: [string, number][] = [["Todas", 0], ["4.0+", 4], ["4.5+", 4.5]];

function slotsFor(durationMin: number) {
  const out: string[] = [];
  const step = durationMin >= 90 ? 90 : 60;
  for (let t = 14 * 60; t <= 23 * 60; t += step)
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  return out;
}

export function SearchView() {
  const { data: courts = [], isLoading } = useCourts();
  const { userPos, setUserPos, showToast } = useUI();
  const [filter, setFilter] = useState<string>("Todas");
  const [dayIdx, setDayIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("rating");
  const [sel, setSel] = useState<{ court: CourtCard; date: Date; time: string } | null>(null);
  const [mapCourt, setMapCourt] = useState<CourtCard | null>(null);

  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }), []);
  const date = dates[dayIdx];
  const dateISO = date.toISOString().slice(0, 10);
  const isToday = dayIdx === 0;
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

  const maxPrice = useMemo(() => (courts.length ? Math.max(...courts.map((c) => c.price_ars)) : 60000), [courts]);
  const minPrice = useMemo(() => (courts.length ? Math.min(...courts.map((c) => c.price_ars)) : 10000), [courts]);
  const [priceCap, setPriceCap] = useState<number | null>(null);
  const cap = priceCap ?? maxPrice;

  // ocupación del día (RPC, no expone datos personales)
  const { data: taken = [] } = useQuery({
    queryKey: ["availability", dateISO],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("day_availability", { p_date: dateISO });
      if (error) throw error;
      return (data ?? []) as { court_id: string; start_time: string }[];
    },
  });
  const takenSet = useMemo(() => new Set(taken.map((t) => t.court_id + "|" + t.start_time.slice(0, 5))), [taken]);

  function locateMe() {
    if (!navigator.geolocation) { showToast("Tu dispositivo no permite ubicación", true); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setSort("cerca"); showToast("Ordenando por cercanía"); },
      () => showToast("No pudimos obtener tu ubicación. Probá por localidad", true), { timeout: 8000 });
  }

  const list = useMemo(() => {
    let r = courts
      .filter((c) => !FILTER_SPORT[filter] || c.sport === FILTER_SPORT[filter])
      .filter((c) => !query.trim() || (c.locality ?? "").toLowerCase().includes(query.trim().toLowerCase()))
      .filter((c) => c.price_ars <= cap)
      .filter((c) => c.rating >= minRating)
      .map((c) => ({ ...c, dist: userPos && c.lat && c.lng ? haversine(userPos.lat, userPos.lng, c.lat, c.lng) : null }));
    const key =
      sort === "cerca" && userPos ? (a: any, b: any) => (a.dist ?? 9e9) - (b.dist ?? 9e9)
      : sort === "precio" ? (a: any, b: any) => a.price_ars - b.price_ars
      : (a: any, b: any) => b.rating - a.rating;
    return r.sort(key);
  }, [courts, filter, query, cap, minRating, sort, userPos]);

  const locs = useMemo(() => [...new Set(courts.map((c) => c.locality).filter(Boolean))] as string[], [courts]);

  return (
    <>
      <div className="vt-filters">
        <div className="vt-row">
          <div className="vt-search"><Pin /><input list="locs" placeholder="Buscar por localidad…" value={query} onChange={(e) => setQuery(e.target.value)} /><datalist id="locs">{locs.map((l) => <option key={l} value={l} />)}</datalist></div>
          <button className={"vt-geo" + (userPos ? "" : " off")} onClick={locateMe}><Pin /> {userPos ? "Cerca mío ✓" : "Cerca mío"}</button>
          <select className="vt-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {userPos && <option value="cerca">Más cerca</option>}
            <option value="rating">Mejor puntuadas</option>
            <option value="precio">Menor precio</option>
          </select>
        </div>
        <div className="vt-row"><span className="vt-label">Deporte</span>{FILTERS.map((f) => <button key={f} className={"vt-chip" + (filter === f ? " on" : "")} onClick={() => { setFilter(f); setSel(null); }}>{f}</button>)}</div>
        <div className="vt-row"><span className="vt-label">Estrellas</span>
          {RATINGS.map(([lbl, v]) => <button key={lbl} className={"vt-chip" + (minRating === v ? " on" : "")} onClick={() => setMinRating(v)}>{lbl}</button>)}
          <div className="vt-priceblk"><input type="range" min={minPrice} max={maxPrice} step={1000} value={cap} onChange={(e) => setPriceCap(+e.target.value)} /><span className="vt-priceval">Hasta {ARS.format(cap)}</span></div>
        </div>
        <div className="vt-row"><span className="vt-label">Día</span>
          {dates.map((d, i) => <button key={i} className={"vt-chip vt-daychip" + (dayIdx === i ? " on" : "")} onClick={() => { setDayIdx(i); setSel(null); }}><span className="d">{i === 0 ? "HOY" : DAYS[d.getDay()]}</span><span className="n">{d.getDate()}</span></button>)}
        </div>
      </div>

      <div className="vt-count">{isLoading ? "Cargando canchas…" : <><b>{list.length}</b> {list.length === 1 ? "cancha" : "canchas"}{userPos ? " · por cercanía" : ""}</>}</div>

      <main className="vt-grid">
        {!isLoading && list.length === 0 && <div className="vt-empty">No hay canchas con esos filtros.</div>}
        {list.map((court) => {
          const fam = sportFamily(court.sport);
          return (
            <article key={court.id} className="vt-card" data-sport={fam}>
              <div className="vt-banner">
                <Carousel sport={fam} />
                <div className="vt-ov vt-rate"><svg viewBox="0 0 20 20"><path d={STAR} /></svg>{Number(court.rating).toFixed(1)} <span>({court.reviews_count})</span></div>
                <div className="vt-ov vt-priceov"><b>{ARS.format(court.price_ars)}</b><em>turno {court.duration_min}'</em></div>
                {court.dist != null && <div className="vt-ov vt-dist"><Pin />{km(court.dist)}</div>}
              </div>
              <div className="vt-body">
                <div className="vt-cname">{court.name}</div>
                <div className="vt-loc"><Pin />{court.locality} · {court.club_name}</div>
                <div className="vt-distrow">
                  {court.dist != null
                    ? <span className="vt-distbig"><Pin />A {km(court.dist)} tuyo</span>
                    : <span className="vt-distbig muted"><Pin />Activá "Cerca mío" para ver distancia</span>}
                  <button className="vt-mapbtn" onClick={() => setMapCourt(court)}><Pin />Ver ubicación</button>
                </div>
                <div className="vt-meta2"><Stars value={court.rating} /> {Number(court.rating).toFixed(1)} · {court.reviews_count} reseñas</div>
                {court.surface && <div className="vt-surface"><i />{court.surface}</div>}
                <div className="vt-slots">
                  {slotsFor(court.duration_min).map((t) => {
                    const isPast = isToday && +t.slice(0, 2) * 60 + +t.slice(3) <= nowMin;
                    const isTaken = takenSet.has(court.id + "|" + t);
                    const isSel = sel?.court.id === court.id && sel?.time === t;
                    const st = isSel ? "sel" : isPast ? "past" : isTaken ? "taken" : "free";
                    const can = st === "free";
                    return (
                      <div key={t} className={"vt-slot " + st}
                        onClick={can ? () => setSel({ court, date, time: t }) : undefined}
                        role={can ? "button" : undefined} tabIndex={can ? 0 : undefined}>
                        {t}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {mapCourt && <MapModal court={mapCourt} dist={userPos && mapCourt.lat && mapCourt.lng ? haversine(userPos.lat, userPos.lng, mapCourt.lat, mapCourt.lng) : null} onClose={() => setMapCourt(null)} />}
      <BookingBar sel={sel} onClear={() => setSel(null)} />
    </>
  );
}
