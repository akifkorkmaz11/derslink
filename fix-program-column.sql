-- Program sütununu enrolled_program olarak değiştir
-- Bu script mevcut veritabanındaki program sütununu enrolled_program olarak yeniden adlandırır

-- Önce sütunun var olup olmadığını kontrol et
DO $$
BEGIN
    -- Eğer program sütunu varsa ve enrolled_program sütunu yoksa
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'program'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'enrolled_program'
    ) THEN
        -- Sütunu yeniden adlandır
        ALTER TABLE users RENAME COLUMN program TO enrolled_program;
        RAISE NOTICE 'program sütunu enrolled_program olarak yeniden adlandırıldı';
    ELSE
        RAISE NOTICE 'program sütunu zaten enrolled_program olarak mevcut veya program sütunu yok';
    END IF;
END $$;

-- İndeksi de güncelle
DROP INDEX IF EXISTS idx_users_program;
CREATE INDEX IF NOT EXISTS idx_users_enrolled_program ON users(enrolled_program);

-- Sonuçları kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('program', 'enrolled_program')
ORDER BY column_name;

