-- Tabela de Configurações Globais
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY,
  is_finalized BOOLEAN DEFAULT false NOT NULL,
  final_message TEXT DEFAULT 'Obrigado a todos pela participação na Gincana!' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública
CREATE POLICY "Settings viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

-- Inserir registro único inicial
INSERT INTO public.settings (id, is_finalized, final_message) 
VALUES (1, false, 'Obrigado a todos pela participação na Gincana!')
ON CONFLICT (id) DO NOTHING;

-- Adicionar a tabela de settings ao realtime (caso não exista)
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
