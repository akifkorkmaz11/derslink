-- Payments tablosuna temp_data alanı ekle
ALTER TABLE payments ADD COLUMN IF NOT EXISTS temp_data TEXT;

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_payments_temp_data ON payments(temp_data) WHERE temp_data IS NOT NULL;
