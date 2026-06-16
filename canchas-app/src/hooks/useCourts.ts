import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { CourtCard } from "../types/db";

export function useCourts() {
  return useQuery({
    queryKey: ["court_cards"],
    queryFn: async (): Promise<CourtCard[]> => {
      const { data, error } = await supabase
        .from("court_cards")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CourtCard[];
    },
  });
}
