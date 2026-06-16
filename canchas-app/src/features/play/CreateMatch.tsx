import { useState } from "react";
import { useCreateMatch } from "../../hooks/useOpenMatches";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../store/ui";
import type { Sport } from "../../types/db";

const SPORTS: [Sport, string][] = [
  ["padel", "Pádel"], ["futbol_5", "Fútbol 5"], ["futbol_7", "Fútbol 7"], ["tenis", "Tenis"],
];

export function CreateMatch({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const showToast = useUI((s) => s.showToast);
  const createMatch = useCreateMatch();
  const [sport, setSport] = useState<Sport>("padel");
  const [locality, setLocality] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [spots, setSpots] = useState(4);
  const [gender, setGender] = useState("Mixto");
  const [notes, setNotes] = useState("");

  // ventana: hoy → 16 días (lo valida también el trigger fn_match_window)
  const today = new Date().toISOString().slice(0, 10);
  const max = new Date(Date.now() + 16 * 864e5).toISOString().slice(0, 10);

  async function submit() {
    if (!user) { showToast("Ingresá para crear un partido", true); return; }
    if (!locality || !date) { showToast("Completá localidad y fecha", true); return; }
    try {
      await createMatch.mutateAsync({
        creator_id: user.id, sport, locality, play_date: date, start_time: time,
        level_min: 1, level_max: 10, spots_total: spots, gender, notes,
      });
      showToast("Partido publicado ✓");
      onClose();
    } catch (e: any) {
      showToast(e.message ?? "No se pudo publicar", true);
    }
  }

  return (
    <div className="vt-modal" onClick={onClose}>
      <div className="cm-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="vt-close" onClick={onClose} aria-label="Cerrar">×</button>
        <h3 className="cm-title">Crear partido</h3>
        <p className="cm-sub">Publicá tu partido y que se sumen jugadores cerca tuyo.</p>

        <label className="cm-lab">Deporte</label>
        <div className="cm-chips">
          {SPORTS.map(([v, l]) => <button key={v} className={"cm-chip" + (sport === v ? " on" : "")} onClick={() => setSport(v)}>{l}</button>)}
        </div>

        <label className="cm-lab">Localidad</label>
        <input className="cm-inp" placeholder="Castelar" value={locality} onChange={(e) => setLocality(e.target.value)} />

        <div className="cm-grid">
          <div><label className="cm-lab">Día</label><input className="cm-inp" type="date" min={today} max={max} value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="cm-lab">Hora</label><input className="cm-inp" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        </div>

        <div className="cm-grid">
          <div><label className="cm-lab">Cupos totales</label><input className="cm-inp" type="number" min={2} max={22} value={spots} onChange={(e) => setSpots(+e.target.value)} /></div>
          <div><label className="cm-lab">Modalidad</label>
            <select className="cm-inp" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Mixto</option><option>Masculino</option><option>Femenino</option>
            </select>
          </div>
        </div>

        <label className="cm-lab">Nota (opcional)</label>
        <input className="cm-inp" placeholder="Falta uno para completar" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <button className="cm-cta" disabled={createMatch.isPending} onClick={submit}>{createMatch.isPending ? "Publicando…" : "Publicar partido"}</button>
      </div>
    </div>
  );
}
