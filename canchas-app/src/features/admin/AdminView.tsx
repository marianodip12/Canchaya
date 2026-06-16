import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { ARS } from "../../lib/format";
import { useAuth } from "../../hooks/useAuth";

// Panel del dueño: lee SUS clubs y reservas (RLS deja ver solo lo propio).
export function AdminView() {
  const { user } = useAuth();
  const [model, setModel] = useState<"trial" | "mensual" | "comision">("comision");
  const [pct, setPct] = useState(6);
  const [monthly, setMonthly] = useState(20000);

  const { data: clubs = [] } = useQuery({
    queryKey: ["my_clubs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("clubs").select("id,name").eq("owner_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["my_reservations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("id,reserved_date,gross_ars,platform_fee_ars,mp_fee_ars,club_net_ars,base_price_ars,discount_ars")
        .order("reserved_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const recaudado = useMemo(() => reservations.reduce((s, r: any) => s + (r.gross_ars || r.base_price_ars || 0), 0), [reservations]);
  const income = model === "mensual" ? clubs.length * monthly
    : model === "comision" ? reservations.reduce((s, r: any) => s + Math.round((r.gross_ars || r.base_price_ars || 0) * pct / 100), 0)
    : 0;

  if (!user) return <div className="vt-empty">Ingresá con tu cuenta de dueño para ver el panel.</div>;

  return (
    <div className="vt-admin">
      <div className="vt-kpis">
        <div className="vt-kpi"><div className="k">Tus clubs</div><div className="v">{clubs.length}</div></div>
        <div className="vt-kpi"><div className="k">Reservas</div><div className="v">{reservations.length}</div></div>
        <div className="vt-kpi"><div className="k">Recaudación</div><div className="v">{ARS.format(recaudado)}</div></div>
        <div className="vt-kpi amber"><div className="k">Tu ingreso</div><div className="v">{ARS.format(income)}</div></div>
      </div>

      <div className="vt-block">
        <h2>Modelo de cobro (escalonado)</h2>
        <div className="vt-models">
          <div className={"vt-model" + (model === "trial" ? " on" : "")} onClick={() => setModel("trial")}>
            <div className="mt">🎟️ Trial → 5 gratis</div><div className="md">Primeras 5 reservas sin cargo.</div><div className="income">$0</div>
          </div>
          <div className={"vt-model" + (model === "mensual" ? " on" : "")} onClick={() => setModel("mensual")}>
            <div className="mt">📅 Abono mensual</div><div className="md">Fijo por cancha.</div><div className="income">{ARS.format(clubs.length * monthly)}/mes</div>
            <div className="vt-inp"><input type="number" value={monthly} step={1000} onChange={(e) => setMonthly(+e.target.value)} /><label>$ x cancha</label></div>
          </div>
          <div className={"vt-model" + (model === "comision" ? " on" : "")} onClick={() => setModel("comision")}>
            <div className="mt">📈 Comisión</div><div className="md">% por reserva (3 meses+).</div>
            <div className="income">{ARS.format(reservations.reduce((s, r: any) => s + Math.round((r.gross_ars || r.base_price_ars || 0) * pct / 100), 0))}/mes</div>
            <div className="vt-inp"><input type="number" value={pct} min={0} max={20} onChange={(e) => setPct(+e.target.value)} /><label>% por reserva</label></div>
          </div>
        </div>
      </div>

      <div className="vt-block">
        <h2>Reservas · split</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="vt-table">
            <thead><tr><th>Día</th><th>Total</th><th>Descuento</th><th>Com. MP</th><th>Tu comisión</th><th>Neto dueño</th></tr></thead>
            <tbody>
              {reservations.length === 0 && <tr><td colSpan={6} style={{ color: "var(--muted)" }}>Todavía no hay reservas. Reservá desde el buscador para ver el split.</td></tr>}
              {reservations.map((r: any) => (
                <tr key={r.id}>
                  <td className="mono">{r.reserved_date}</td>
                  <td className="mono">{ARS.format(r.gross_ars || r.base_price_ars)}</td>
                  <td className="mono">{r.discount_ars ? "−" + ARS.format(r.discount_ars) : "—"}</td>
                  <td className="mono">−{ARS.format(r.mp_fee_ars)}</td>
                  <td className="mono you">{r.platform_fee_ars ? "+" + ARS.format(r.platform_fee_ars) : "—"}</td>
                  <td className="mono net">{ARS.format(r.club_net_ars)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
