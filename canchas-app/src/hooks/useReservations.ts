import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { NewReservation } from "../types/db";

// El trigger fn_reservation_split() de la base completa solo descuento,
// comisión, fee de MP y neto del dueño. Acá solo insertamos lo base.
export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: NewReservation) => {
      const { data, error } = await supabase
        .from("reservations")
        .insert({ ...r, status: r.status ?? "pending" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });
}
