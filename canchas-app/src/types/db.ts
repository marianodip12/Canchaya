export type Sport =
  | "futbol_5" | "futbol_7" | "futbol_11"
  | "padel" | "tenis" | "basquet" | "hockey" | "otro";

export interface CourtCard {
  id: string;
  club_id: string;
  name: string;
  sport: Sport;
  surface: string | null;
  indoor: boolean;
  price_ars: number;
  duration_min: number;
  photos: string[];
  active: boolean;
  club_name: string;
  locality: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating: number;
  reviews_count: number;
}

export interface OpenMatchCard {
  id: string;
  sport: Sport;
  locality: string | null;
  lat: number | null;
  lng: number | null;
  play_date: string;       // ISO date
  start_time: string | null;
  level_min: number;
  level_max: number;
  spots_total: number;
  spots_taken: number;
  spots_left: number;
  gender: string;
  notes: string | null;
  status: string;
  club_id: string | null;
  creator_id: string;
  creator_name: string;
}

export interface Tournament {
  id: string;
  club_id: string;
  sport: Sport;
  name: string;
  description: string | null;
  format: string | null;
  starts_on: string | null;
  ends_on: string | null;
  max_teams: number | null;
  team_size: number;
  price_per_team_ars: number;
  status: string;
}

export interface Equipment {
  id: string;
  club_id: string;
  type: string;
  name: string;
  price_ars: number;
  stock: number;
}

export interface NewReservation {
  court_id: string;
  club_id: string;
  player_id: string;
  sport: Sport;
  reserved_date: string;
  start_time: string;
  duration_min: number;
  base_price_ars: number;
  status?: string;
}

export interface NewOpenMatch {
  creator_id: string;
  sport: Sport;
  locality: string;
  play_date: string;
  start_time: string;
  level_min: number;
  level_max: number;
  spots_total: number;
  gender: string;
  notes?: string;
  club_id?: string | null;
}
