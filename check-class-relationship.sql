-- class_schedules tablosunun yapısını kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'class_schedules'
ORDER BY ordinal_position;

-- classes tablosunun yapısını kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- Foreign key ilişkilerini kontrol et
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'class_schedules';

-- Örnek veri kontrolü
SELECT 
    cs.id,
    cs.class_id,
    cs.teacher_name,
    cs.subject,
    c.class_name,
    c.schedule_type
FROM class_schedules cs
LEFT JOIN classes c ON cs.class_id = c.id
LIMIT 10;
