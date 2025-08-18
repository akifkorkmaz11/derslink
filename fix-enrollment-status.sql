-- class_enrollments tablosuna status sütunu ekle
-- Bu script mevcut veritabanındaki class_enrollments tablosuna status sütunu ekler

-- Status sütununu ekle (eğer yoksa)
DO $$
BEGIN
    -- Eğer status sütunu yoksa ekle
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'class_enrollments' AND column_name = 'status'
    ) THEN
        ALTER TABLE class_enrollments ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        RAISE NOTICE 'status sütunu class_enrollments tablosuna eklendi';
    ELSE
        RAISE NOTICE 'status sütunu zaten mevcut';
    END IF;
END $$;

-- Mevcut kayıtları 'active' olarak güncelle
UPDATE class_enrollments SET status = 'active' WHERE status IS NULL;

-- Sonuçları kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'class_enrollments' 
AND column_name = 'status';

-- Örnek veri kontrolü
SELECT 
    COUNT(*) as total_enrollments,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_enrollments,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as null_status
FROM class_enrollments;

