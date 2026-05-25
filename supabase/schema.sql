-- 1. Create Tables
CREATE TABLE public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  total_score INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.score_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Setup Realtime
-- This tells Supabase to broadcast changes from score_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.score_logs;

-- 3. Row Level Security (RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_logs ENABLE ROW LEVEL SECURITY;

-- Teams: anyone can read, only admin can insert/update
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.teams FOR SELECT
  USING (true);

-- Score Logs: anyone can read (for realtime), only admin can insert
CREATE POLICY "Score logs are viewable by everyone."
  ON public.score_logs FOR SELECT
  USING (true);

-- 4. Initial Data
INSERT INTO public.teams (name, color) VALUES
('Vermelha', '#ef4444'),
('Azul', '#3b82f6'),
('Amarela', '#eab308'),
('Verde', '#22c55e');

-- Note: Para inserção, criaremos políticas de autenticação depois. 
-- Temporariamente, insira via painel admin usando a Service Role, 
-- ou ative inserção apenas para usuários logados.
