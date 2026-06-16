import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Tournament } from "../types/db";

export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async (): Promise<Tournament[]> => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .in("status", ["open", "full", "in_progress"])
        .order("starts_on", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Tournament[];
    },
  });
}
