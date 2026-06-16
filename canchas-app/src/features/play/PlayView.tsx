import { useState } from "react";
import { useOpenMatches, useJoinMatch } from "../../hooks/useOpenMatches";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../store/ui";
import { DAYS, SPORT_LABEL, sportFamily, haversine, km } from "../../lib/format";
import { CourtPhoto } from "../../components/CourtPhoto";
import { Pin, IcoCal, IcoUsers } from "../../components/icons";
import { CreateMatch } from "./CreateMatch";
import type { OpenMatchCard } from "../../types/db";

function dayLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${DAYS[d.getDay()]} ${d.getDate()}`;
}

function Card({ m, userPos, style }: { m: OpenMatchCard; userPos: { lat: number; lng: number } | null; style: React.CSSProperties }) {
  const fam = sportFamily(m.sport);
  const dist = userPos && m.lat && m.lng ? haversine(userPos.lat, userPos.lng, m.lat, m.lng) : null;
  return (
    <div className="jg-card" data-sport={fam} style={style}>
      <div className="jg-banner"><CourtPhoto sport={fam} idx={2} /><span className="jg-sportbadge">{SPORT_LABEL[m.sport]} · {m.gender}</span></div>
      <div className="jg-info">
        <div className="jg-falt">Faltan {m.spots_left} {m.spots_left === 1 ? "jugador" : "jugadores"}</div>
        <div className="jg-meta">
          <div className="jg-mrow"><IcoCal /><span className="lab">Cuándo:</span> {dayLabel(m.play_date)} · {m.start_time?.slice(0, 5)}</div>
          <div className="jg-mrow"><Pin /><span className="lab">Dónde:</span> {m.locality}{dist != null ? ` · a ${km(dist)}` : ""}</div>
          <div className="jg-mrow"><IcoUsers /><span className="lab">Anotados:</span> {m.spots_taken}/{m.spots_total}</div>
        </div>
        <div className="jg-creator">Organiza {m.creator_name}</div>
      </div>
    </div>
  );
}

export function PlayView() {
  const { data: matches = [], isLoading } = useOpenMatches();
  const { user } = useAuth();
  const { userPos, showToast } = useUI();
  const join = useJoinMatch();
  const [idx, setIdx] = useState(0);
  const [swipe, setSwipe] = useState<"left" | "right" | null>(null);
  const [creating, setCreating] = useState(false);

  function act(dir: "left" | "right") {
    const m = matches[idx];
    setSwipe(dir);
    setTimeout(async () => {
      if (dir === "right" && m) {
        if (!user) showToast("Ingresá para sumarte", true);
        else {
          try { await join.mutateAsync({ matchId: m.id, playerId: user.id }); showToast("Te sumaste al partido ✓"); }
          catch (e: any) { showToast(e.message ?? "No se pudo", true); }
        }
      }
      setIdx((i) => i + 1);
      setSwipe(null);
    }, 320);
  }

  const done = !isLoading && idx >= matches.length;

  return (
    <div className="jg-wrap">
      <div className="jg-head">
        <p className="jg-intro">Partidos cerca tuyo que buscan jugadores.</p>
        <button className="jg-create" onClick={() => setCreating(true)}>+ Crear partido</button>
      </div>

      {isLoading && <div className="vt-empty">Cargando partidos…</div>}

      {done && <div className="vt-empty">No hay más partidos cerca tuyo. Creá uno vos.</div>}

      {!isLoading && !done && (
        <>
          <div className="jg-stack">
            {matches.slice(idx, idx + 3).map((m, i) => {
              const style: React.CSSProperties = i === 0 && swipe
                ? { transform: `translateX(${swipe === "right" ? 440 : -440}px) rotate(${swipe === "right" ? 16 : -16}deg)`, opacity: 0, zIndex: 30 }
                : { transform: `scale(${1 - i * 0.04}) translateY(${i * 12}px)`, zIndex: 20 - i };
              return <Card key={m.id} m={m} userPos={userPos} style={style} />;
            })}
          </div>
          <div className="jg-actions">
            <button className="jg-btn no" onClick={() => act("left")}>✕ Paso</button>
            <button className="jg-btn yes" onClick={() => act("right")}>✓ Sumarme</button>
          </div>
        </>
      )}

      {creating && <CreateMatch onClose={() => setCreating(false)} />}
    </div>
  );
}
