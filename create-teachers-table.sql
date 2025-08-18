-- Öğretmenler tablosu oluşturma
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    branch VARCHAR(255) NOT NULL,
    specialties TEXT,
    initial VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    zoom_link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gerçek TYT/AYT Öğretmenlerini Ekle
INSERT INTO teachers (name, branch, specialties, initial, status, zoom_link) VALUES
-- TYT/AYT Matematik Öğretmenleri
('Hoca1', 'TYT Matematik', 'TYT, Matematik', 'H1', 'active', 'https://zoom.us/j/111111111'),
('Hoca2', 'TYT Matematik', 'TYT, Matematik', 'H2', 'active', 'https://zoom.us/j/222222222'),
('Hoca3', 'AYT Matematik', 'AYT, Matematik', 'H3', 'active', 'https://zoom.us/j/333333333'),
('Hoca4', 'AYT Matematik', 'AYT, Matematik', 'H4', 'active', 'https://zoom.us/j/444444444'),
('Hoca5', 'AYT Matematik', 'AYT, Matematik', 'H5', 'active', 'https://zoom.us/j/555555555'),

-- TYT/AYT Fen Bilimleri Öğretmenleri
('Hoca6', 'Fizik', 'TYT, AYT, Fizik', 'H6', 'active', 'https://zoom.us/j/666666666'),
('Hoca7', 'Fizik', 'TYT, AYT, Fizik', 'H7', 'active', 'https://zoom.us/j/777777777'),
('Hoca8', 'Fizik', 'TYT, AYT, Fizik', 'H8', 'active', 'https://zoom.us/j/888888888'),
('Hoca9', 'Kimya', 'TYT, AYT, Kimya', 'H9', 'active', 'https://zoom.us/j/999999999'),
('Hoca10', 'Kimya', 'TYT, AYT, Kimya', 'H10', 'active', 'https://zoom.us/j/101010101'),
('Hoca11', 'Biyoloji', 'TYT, AYT, Biyoloji', 'H11', 'active', 'https://zoom.us/j/111111112'),
('Hoca12', 'Biyoloji', 'TYT, AYT, Biyoloji', 'H12', 'active', 'https://zoom.us/j/121212121'),

-- TYT/AYT Sosyal Bilimler Öğretmenleri
('Hoca13', 'Edebiyat', 'AYT, Edebiyat', 'H13', 'active', 'https://zoom.us/j/131313131'),
('Hoca14', 'Coğrafya', 'TYT, AYT, Coğrafya', 'H14', 'active', 'https://zoom.us/j/141414141'),
('Hoca15', 'Tarih', 'TYT, AYT, Tarih', 'H15', 'active', 'https://zoom.us/j/151515151'),
('Hoca16', 'Felsefe', 'TYT, AYT, Felsefe', 'H16', 'active', 'https://zoom.us/j/161616161')
ON CONFLICT (name) DO UPDATE SET
    branch = EXCLUDED.branch,
    specialties = EXCLUDED.specialties,
    initial = EXCLUDED.initial,
    status = EXCLUDED.status,
    zoom_link = EXCLUDED.zoom_link;

-- teacher_id sütununu class_schedules tablosuna ekle
ALTER TABLE class_schedules ADD COLUMN IF NOT EXISTS teacher_id INTEGER REFERENCES teachers(id);

-- Mevcut class_schedules kayıtlarını öğretmenlerle eşleştir
UPDATE class_schedules 
SET teacher_id = t.id 
FROM teachers t 
WHERE class_schedules.teacher_name = t.name 
AND class_schedules.teacher_id IS NULL;
