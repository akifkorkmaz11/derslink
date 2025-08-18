-- Saat formatını düzelt - saniye kısmını kaldır
-- Bu script class_schedules tablosundaki start_time ve end_time alanlarındaki saniye kısmını kaldırır

-- Önce mevcut verileri kontrol et
SELECT 
    id,
    start_time,
    end_time,
    CASE 
        WHEN start_time LIKE '%:%:%' THEN 
            CONCAT(
                SPLIT_PART(start_time, ':', 1), 
                ':', 
                SPLIT_PART(start_time, ':', 2)
            )
        ELSE start_time 
    END as new_start_time,
    CASE 
        WHEN end_time LIKE '%:%:%' THEN 
            CONCAT(
                SPLIT_PART(end_time, ':', 1), 
                ':', 
                SPLIT_PART(end_time, ':', 2)
            )
        ELSE end_time 
    END as new_end_time
FROM class_schedules 
WHERE start_time LIKE '%:%:%' OR end_time LIKE '%:%:%'
LIMIT 10;

-- Saniye kısmı olan verileri güncelle
UPDATE class_schedules 
SET 
    start_time = CASE 
        WHEN start_time LIKE '%:%:%' THEN 
            CONCAT(
                SPLIT_PART(start_time, ':', 1), 
                ':', 
                SPLIT_PART(start_time, ':', 2)
            )
        ELSE start_time 
    END,
    end_time = CASE 
        WHEN end_time LIKE '%:%:%' THEN 
            CONCAT(
                SPLIT_PART(end_time, ':', 1), 
                ':', 
                SPLIT_PART(end_time, ':', 2)
            )
        ELSE end_time 
    END
WHERE start_time LIKE '%:%:%' OR end_time LIKE '%:%:%';

-- Güncelleme sonrası kontrol
SELECT 
    id,
    start_time,
    end_time,
    subject,
    day_of_week
FROM class_schedules 
LIMIT 10;
