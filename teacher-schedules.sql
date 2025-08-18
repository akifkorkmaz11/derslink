-- Öğretmen Ders Programları
-- Güncellenmiş LGS Programlarına Göre Her Öğretmenin Ders Programı

-- 1. Yusuf Cangat Altınışık (Matematik) - Ders Programı
SELECT 
    'Yusuf Cangat Altınışık' as teacher_name,
    'Matematik' as subject,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
WHERE cs.teacher_name = 'Yusuf Cangat Altınışık'
ORDER BY 
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END,
    cs.start_time;

-- 2. Zülküf Memiş (Fen Bilgisi) - Ders Programı
SELECT 
    'Zülküf Memiş' as teacher_name,
    'Fen Bilgisi' as subject,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
WHERE cs.teacher_name = 'Zülküf Memiş'
ORDER BY 
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END,
    cs.start_time;

-- 3. Zeynep Sarı (Türkçe) - Ders Programı
SELECT 
    'Zeynep Sarı' as teacher_name,
    'Türkçe' as subject,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
WHERE cs.teacher_name = 'Zeynep Sarı'
ORDER BY 
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END,
    cs.start_time;

-- 4. İshak Bilgin (Din Kültürü) - Ders Programı
SELECT 
    'İshak Bilgin' as teacher_name,
    'Din Kültürü' as subject,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
WHERE cs.teacher_name = 'İshak Bilgin'
ORDER BY 
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END,
    cs.start_time;

-- 5. Menekşe Nur Sucu (T.C. İnkılap Tarihi) - Ders Programı
SELECT 
    'Menekşe Nur Sucu' as teacher_name,
    'T.C. İnkılap Tarihi' as subject,
    cs.day_of_week,
    cs.start_time,
    cs.end_time,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
WHERE cs.teacher_name = 'Menekşe Nur Sucu'
ORDER BY 
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END,
    cs.start_time;

-- Öğretmen Başına Toplam Ders Saati Özeti
SELECT 
    cs.teacher_name,
    cs.subject,
    COUNT(*) as total_lessons,
    COUNT(*) * 40 as total_minutes,
    ROUND(COUNT(*) * 40.0 / 60, 1) as total_hours
FROM class_schedules cs
GROUP BY cs.teacher_name, cs.subject
ORDER BY cs.teacher_name, cs.subject;

-- Günlük Öğretmen Programı Özeti
SELECT 
    cs.teacher_name,
    cs.subject,
    cs.day_of_week,
    COUNT(*) as lessons_per_day,
    MIN(cs.start_time) as first_lesson,
    MAX(cs.end_time) as last_lesson
FROM class_schedules cs
GROUP BY cs.teacher_name, cs.subject, cs.day_of_week
ORDER BY 
    cs.teacher_name,
    CASE cs.day_of_week 
        WHEN 'Pazartesi' THEN 1
        WHEN 'Salı' THEN 2
        WHEN 'Çarşamba' THEN 3
        WHEN 'Perşembe' THEN 4
        WHEN 'Cuma' THEN 5
        WHEN 'Cumartesi' THEN 6
        WHEN 'Pazar' THEN 7
    END;


