-- class_schedules tablosundaki program alanını güncelle
-- LGS sınıfları için
UPDATE class_schedules 
SET program = 'LGS' 
WHERE class_id IN (SELECT id FROM classes WHERE program = 'LGS');

-- YKS sınıfları için  
UPDATE class_schedules 
SET program = 'YKS' 
WHERE class_id IN (SELECT id FROM classes WHERE program = 'YKS');

-- Kontrol sorgusu
SELECT 
    cs.program,
    c.class_name,
    c.program as class_program,
    COUNT(*) as schedule_count
FROM class_schedules cs
JOIN classes c ON cs.class_id = c.id
GROUP BY cs.program, c.class_name, c.program
ORDER BY cs.program, c.class_name;
