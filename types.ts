
export interface League {
  name: string;
  league_id: string;
  season: string;
  status: string;
  total_rosters: number;
  settings: {
    max_keepers: number;
    type: number;
    leg: number;
    playoff_week_start: number;
  };
  avatar: string | null;
  previous_league_id: string | null;
}

export interface User {
  user_id: string;
  display_name: string;
  avatar: string | null;
  metadata: {
    team_name?: string;
    avatar?: string;
  };
}

export interface Roster {
  roster_id: number;
  owner_id: string;
  league_id: string;
  players: string[];
  starters: string[];
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal: number;
    ppts: number;
    ppts_decimal: number;
  };
}

export interface Matchup {
  matchup_id: number;
  roster_id: number;
  points: number;
  starters: string[];
  players: string[];
}

export interface Transaction {
  type: "trade" | "free_agent" | "waiver";
  status: string;
  roster_ids: number[];
  drops: Record<string, number> | null;
  adds: Record<string, number> | null;
  created: number;
  transaction_id: string;
}

export interface BracketMatch {
  r: number; // Round
  m: number; // Matchup ID
  t1: number | null; // Roster ID 1
  t2: number | null; // Roster ID 2
  w: number | null; // Winner Roster ID
  l: number | null; // Loser Roster ID
  p?: number; // Place
}

export interface Player {
  player_id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position: string;
  team: string;
}

export interface AppData {
  league: League;
  users: User[];
  rosters: Roster[];
  matchups: Matchup[];
  transactions: Transaction[];
  winnersBracket: BracketMatch[];
  players: Record<string, Player>;
  loading: boolean;
  error: string | null;
}
