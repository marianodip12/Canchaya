import { useTournaments } from "../../hooks/useTournaments";
import { ARS, SPORT_LABEL, sportFamily } from "../../lib/format";
import { Pin } from "../../components/icons";
import { useUI } from "../../store/ui";

export function TournamentsView() {
  const { data: tournaments = [], isLoading } = useTournaments();
  const showToast = useUI((s) => s.showToast);

  if (isLoading) return <div className="vt-empty">Cargando torneos…</div>;
  if (!tournaments.length) return <div className="vt-empty">No hay torneos abiertos por ahora.</div>;

  return (
    <div className="tr-grid">
      {tournaments.map((t) => {
        const fam = sportFamily(t.sport);
        const dates = [t.starts_on, t.ends_on].filter(Boolean).map((d) => new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }));
        return (
          <div className="tr-card" data-sport={fam} key={t.id}>
            <div className="tr-top">
              <div>
                <div className="tr-name">{t.name}</div>
                <div className="tr-club"><Pin />{SPORT_LABEL[t.sport]} · {t.team_size} por equipo</div>
              </div>
              <span className="tr-badge">Abierto</span>
            </div>
            <div className="tr-body">
              <div className="tr-info">
                <div className="tr-cell"><div className="k">Formato</div><div className="v">{t.format ?? "—"}</div></div>
                <div className="tr-cell"><div className="k">Fechas</div><div className="v">{dates.join(" → ") || "A definir"}</div></div>
                <div className="tr-cell"><div className="k">Inscripción</div><div className="v">{ARS.format(t.price_per_team_ars)}</div></div>
                <div className="tr-cell"><div className="k">Cupos</div><div className="v">{t.max_teams ?? "—"} equipos</div></div>
              </div>
              <button className="tr-cta" onClick={() => showToast(`Inscripción enviada · ${t.name}`)}>Inscribirme</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
