-- 1. Create Activities Table
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities are viewable by everyone."
  ON public.activities FOR SELECT
  USING (true);

-- 2. Add Activity column to Score Logs
ALTER TABLE public.score_logs ADD COLUMN activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE;

-- 3. Create a default activity for existing records (Migration)
INSERT INTO public.activities (name) VALUES ('Lançamento Avulso (Migração)');

-- 4. Update existing logs so we don't break the NOT NULL constraint
UPDATE public.score_logs 
SET activity_id = (SELECT id FROM public.activities WHERE name = 'Lançamento Avulso (Migração)' LIMIT 1)
WHERE activity_id IS NULL;

-- 5. Make activity_id NOT NULL
ALTER TABLE public.score_logs ALTER COLUMN activity_id SET NOT NULL;

-- (Optional) If we want we can drop the description column, but let's keep it as an optional "observação"
ALTER TABLE public.score_logs ALTER COLUMN description DROP NOT NULL;
