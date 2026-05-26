-- Habilitar a gravação de decimais (floats) na pontuação e no histórico
ALTER TABLE teams ALTER COLUMN total_score TYPE NUMERIC;
ALTER TABLE score_logs ALTER COLUMN points TYPE NUMERIC;
