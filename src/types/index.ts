export type Team = {
  id: string;
  name: string;
  color: string;
  honoree_name?: string | null;
  total_score: number;
};

export type Activity = {
  id: string;
  name: string;
  created_at: string;
};

export type ScoreLog = {
  id: string;
  team_id: string;
  activity_id: string;
  points: number;
  description?: string; // Optional agora
  created_at: string;
};

export type HistoryLog = {
  id: string;
  points: number;
  description?: string | null;
  created_at: string;
  teams: { id: string; name: string; color: string };
  activities: { id: string; name: string };
};
