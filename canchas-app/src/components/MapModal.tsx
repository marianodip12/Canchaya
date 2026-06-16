import { Pin } from "./icons";
import { km, sportFamily } from "../lib/format";
import type { CourtCard } from "../types/db";

function MiniMap({ fam }: { fam: "futbol" | "padel" | "tenis" }) {
  const accent = fam === "padel" ? "#2BB0F4" : fam === "tenis" ? "#E07A3A" : "#2FD66B";
  const roads = [];
  for (let i = 1; i < 8; i++) roads.push(<line key={"h" + i} x1="0" y1={i * 38} x2="400" y2={i * 38} stroke="#1a2530" strokeWidth="6" />);
  for (let i = 1; i < 11; i++) roads.push(<line key={"v" + i} x1={i * 38} y1="0" x2={i * 38} y2="300" stroke="#1a2530" strokeWidth="6" />);
  const blocks = [];
  for (let x = 0; x < 11; x++) for (let y = 0; y < 8; y++)
    blocks.push(<rect key={x + "-" + y} x={x * 38 + 4} y={y * 38 + 4} width="30" height="30" rx="3" fill={(x + y) % 5 === 0 ? "#13202b" : "#101a23"} />);
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="400" height="300" fill="#0c141b" />{blocks}
      <rect x="266" y="120" width="80" height="64" rx="6" fill="#14361f" />{roads}
      <line x1="0" y1="152" x2="400" y2="152" stroke="#26333f" strokeWidth="9" />
      <line x1="190" y1="0" x2="190" y2="300" stroke="#26333f" strokeWidth="9" />
      <circle cx="200" cy="150" r="60" fill={accent} opacity="0.07" />
    </svg>
  );
}

export function MapModal({ court, dist, onClose }: { court: CourtCard; dist: number | null; onClose: () => void }) {
  const fam = sportFamily(court.sport);
  const accent = fam === "padel" ? "#2BB0F4" : fam === "tenis" ? "#E07A3A" : "#2FD66B";
  return (
    <div className="vt-modal" onClick={onClose}>
      <div className="vt-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="vt-map">
          <button className="vt-close" onClick={onClose} aria-label="Cerrar">×</button>
          <MiniMap fam={fam} />
          <div className="vt-pulse" />
          <div className="vt-mappin">
            <svg viewBox="0 0 24 24" fill={accent}><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" /></svg>
          </div>
        </div>
        <div className="vt-sheet-body">
          <h3>{court.name}</h3>
          <div className="sub"><Pin />{court.locality}, Buenos Aires{dist != null ? ` · a ${km(dist)} tuyo` : ""}</div>
          {court.lat != null && court.lng != null && (
            <a className="vt-goto" href={`https://www.google.com/maps/search/?api=1&query=${court.lat},${court.lng}`} target="_blank" rel="noopener noreferrer">Cómo llegar en Maps</a>
          )}
          <p className="vt-note">El mapa es una representación. En producción va Google Maps / Mapbox con el lat-lng real de la cancha.</p>
        </div>
      </div>
    </div>
  );
}
