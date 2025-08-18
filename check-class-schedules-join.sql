-- class_schedules ve classes tabloları arasındaki join'i kontrol et
SELECT 
    cs.id as schedule_id,
    cs.class_id,
    cs.teacher_name,
    cs.subject,
    cs.day_of_week,
    c.id as class_id_from_classes,
    c.class_name,
    c.program
FROM class_schedules cs
LEFT JOIN classes c ON cs.class_id = c.id
ORDER BY cs.teacher_name, cs.day_of_week, cs.start_time
LIMIT 20;

-- Eşleşmeyen kayıtları bul
SELECT 
    cs.id as schedule_id,
    cs.class_id,
    cs.teacher_name,
    cs.subject,
    cs.day_of_week
FROM class_schedules cs
LEFT JOIN classes c ON cs.class_id = c.id
WHERE c.id IS NULL
ORDER BY cs.teacher_name;

-- Toplam sayıları kontrol et
SELECT 
    'class_schedules' as table_name,
    COUNT(*) as total_records
FROM class_schedules
UNION ALL
SELECT 
    'classes' as table_name,
    COUNT(*) as total_records
FROM classes;
