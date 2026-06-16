import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { OpenMatchCard, NewOpenMatch } from "../types/db";

export function useOpenMatches() {
  return useQuery({
    queryKey: ["open_match_cards"],
    queryFn: async (): Promise<OpenMatchCard[]> => {
      const { data, error } = await supabase
        .from("open_match_cards")
        .select("*")
        .order("play_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as OpenMatchCard[];
    },
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: NewOpenMatch) => {
      const { data, error } = await supabase
        .from("open_matches")
        .insert({ ...m, spots_taken: 1, status: "open" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["open_match_cards"] }),
  });
}

export function useJoinMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, playerId }: { matchId: string; playerId: string }) => {
      const { error } = await supabase
        .from("match_players")
        .insert({ match_id: matchId, player_id: playerId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["open_match_cards"] }),
  });
}
