-- Adicionar campo de descrição/motivo nos lançamentos de pontos
ALTER TABLE score_logs ADD COLUMN IF NOT EXISTS description TEXT;
