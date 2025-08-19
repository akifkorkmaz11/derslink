-- Users tablosuna program detayları sütunları ekle
-- Kullanıcının kayıt olurken seçtiği program bilgilerini saklamak için

-- Yeni sütunları ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS schedule_type VARCHAR(20), -- hafta-ici/hafta-sonu/karma
ADD COLUMN IF NOT EXISTS yks_field VARCHAR(20); -- sayisal/sozel/esit-agirlik (sadece YKS için)

-- Mevcut kullanıcılar için varsayılan değerler
UPDATE users 
SET schedule_type = 'hafta-ici' 
WHERE schedule_type IS NULL;

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_users_schedule_type ON users(schedule_type);
CREATE INDEX IF NOT EXISTS idx_users_yks_field ON users(yks_field);
