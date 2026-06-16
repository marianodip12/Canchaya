import { useState } from "react";
import { ARS, DAYS, sportFamily } from "../lib/format";
import type { CourtCard } from "../types/db";
import { useCreateReservation } from "../hooks/useReservations";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../store/ui";

// Add-ons por familia de deporte (los precios reales viven en canchas.equipment)
const EQUIP: Record<string, { id: string; name: string; price: number }[]> = {
  padel: [{ id: "pal", name: "Paleta", price: 3000 }, { id: "pel", name: "Tubo pelotas", price: 2000 }],
  tenis: [{ id: "raq", name: "Raqueta", price: 3000 }, { id: "pel", name: "Tubo pelotas", price: 2000 }],
  futbol: [{ id: "pech", name: "Pecheras x10", price: 2500 }, { id: "bal", name: "Pelota", price: 1500 }],
};

interface Sel { court: CourtCard; date: Date; time: string }

export function BookingBar({ sel, onClear }: { sel: Sel | null; onClear: () => void }) {
  const { user } = useAuth();
  const showToast = useUI((s) => s.showToast);
  const createRes = useCreateReservation();
  const [equip, setEquip] = useState<{ id: string; price: number }[]>([]);

  const fam = sel ? sportFamily(sel.court.sport) : "futbol";
  const equipTotal = equip.reduce((s, e) => s + e.price, 0);
  const total = sel ? sel.court.price_ars + equipTotal : 0;

  function toggle(it: { id: string; price: number }) {
    setEquip((p) => (p.find((e) => e.id === it.id) ? p.filter((e) => e.id !== it.id) : [...p, it]));
  }

  async function pay() {
    if (!sel) return;
    if (!user) { showToast("Ingresá para reservar", true); return; }
    try {
      await createRes.mutateAsync({
        court_id: sel.court.id,
        club_id: sel.court.club_id,
        player_id: user.id,
        sport: sel.court.sport,
        reserved_date: sel.date.toISOString().slice(0, 10),
        start_time: sel.time,
        duration_min: sel.court.duration_min,
        base_price_ars: sel.court.price_ars,
        status: "pending",
      });
      // TODO: insertar reservation_equipment + crear preferencia de pago MercadoPago (application_fee)
      showToast("Reserva creada ✓ — falta el pago de MercadoPago");
      setEquip([]);
      onClear();
    } catch (e: any) {
      showToast(e.message ?? "No se pudo reservar", true);
    }
  }

  return (
    <div className={"vt-bar" + (sel ? " show" : "")}>
      {sel && (
        <div className="vt-bar-inner">
          <div className="vt-equip">
            <span className="lbl">¿Sumás equipo?</span>
            {(EQUIP[fam] || []).map((it) => {
              const on = equip.find((e) => e.id === it.id);
              return (
                <button key={it.id} className={"vt-eq" + (on ? " on" : "")} onClick={() => toggle(it)}>
                  {on ? "✓ " : "+ "}{it.name} {ARS.format(it.price)}
                </button>
              );
            })}
          </div>
          <div className="vt-resume">
            <div className="vt-rblock"><div className="k">Cancha</div><div className="v">{sel.court.name}</div></div>
            <div className="vt-rblock"><div className="k">Día y hora</div><div className="v mono">{DAYS[sel.date.getDay()]} {sel.date.getDate()} · {sel.time.slice(0, 5)}</div></div>
            <div className="vt-rblock"><div className="k">Total{equipTotal ? " (+equipo)" : ""}</div><div className="v mono amber">{ARS.format(total)}</div></div>
          </div>
          <div className="vt-actions">
            <button className="vt-clear" onClick={() => { setEquip([]); onClear(); }} aria-label="Cancelar">×</button>
            <button className="vt-cta" disabled={createRes.isPending} onClick={pay}>{createRes.isPending ? "..." : "Pagar con MercadoPago"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
