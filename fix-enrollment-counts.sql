-- Mevcut enrollment sayılarını düzelt
-- Bu script tüm sınıfların current_enrollment sayılarını gerçek kayıt sayısına göre günceller

-- Önce tüm sınıfların enrollment sayılarını sıfırla
UPDATE classes SET current_enrollment = 0;

-- Sonra her sınıf için aktif enrollment sayısını hesapla ve güncelle
UPDATE classes 
SET current_enrollment = (
    SELECT COUNT(*) 
    FROM class_enrollments 
    WHERE class_enrollments.class_id = classes.id 
    AND class_enrollments.status = 'active'
);

-- Sonuçları kontrol et
SELECT 
    class_name,
    program_type,
    schedule_type,
    current_enrollment,
    max_students,
    CASE 
        WHEN current_enrollment >= max_students THEN 'DOLU'
        ELSE 'AÇIK'
    END as durum
FROM classes 
ORDER BY program_type, schedule_type, class_name;

