-- Teacher Schedules Tablosu Oluşturma
CREATE TABLE IF NOT EXISTS teacher_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    program VARCHAR(50) NOT NULL, -- LGS, YKS
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    class_name VARCHAR(255),
    schedule_type VARCHAR(50), -- hafta_ici, hafta_sonu, karma
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_teacher_name ON teacher_schedules(teacher_name);
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_program ON teacher_schedules(program);
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_day ON teacher_schedules(day_of_week);

-- Örnek veriler ekleme
INSERT INTO teacher_schedules (teacher_name, subject, program, day_of_week, start_time, end_time, class_name, schedule_type) VALUES
-- LGS Öğretmenleri
('Yusuf Cangat Altınışık', 'Matematik', 'LGS', 'Pazartesi', '09:00', '10:30', 'LGS-A', 'hafta_ici'),
('Yusuf Cangat Altınışık', 'Matematik', 'LGS', 'Salı', '09:00', '10:30', 'LGS-B', 'hafta_ici'),
('Yusuf Cangat Altınışık', 'Matematik', 'LGS', 'Çarşamba', '09:00', '10:30', 'LGS-C', 'hafta_ici'),
('Zülküf Memiş', 'Fen Bilgisi', 'LGS', 'Pazartesi', '10:45', '12:15', 'LGS-A', 'hafta_ici'),
('Zülküf Memiş', 'Fen Bilgisi', 'LGS', 'Salı', '10:45', '12:15', 'LGS-B', 'hafta_ici'),
('Zeynep Sarı', 'Türkçe', 'LGS', 'Çarşamba', '10:45', '12:15', 'LGS-C', 'hafta_ici'),
('İshak Bilgin', 'Din Kültürü', 'LGS', 'Perşembe', '09:00', '10:30', 'LGS-D', 'hafta_ici'),
('Menekşe Nur Sucu', 'T.C. İnkılap Tarihi', 'LGS', 'Cuma', '09:00', '10:30', 'LGS-E', 'hafta_ici'),

-- YKS Öğretmenleri
('Hoca1', 'Matematik', 'YKS', 'Pazartesi', '14:00', '15:30', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca1', 'Matematik', 'YKS', 'Salı', '14:00', '15:30', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca2', 'Fizik', 'YKS', 'Pazartesi', '15:45', '17:15', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca2', 'Fizik', 'YKS', 'Salı', '15:45', '17:15', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca3', 'Kimya', 'YKS', 'Çarşamba', '14:00', '15:30', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca4', 'Biyoloji', 'YKS', 'Çarşamba', '15:45', '17:15', 'YKS Hafta İçi Sayısal 1', 'hafta_ici'),
('Hoca5', 'Türkçe', 'YKS', 'Perşembe', '14:00', '15:30', 'YKS Hafta İçi Eşit Ağırlık 1', 'hafta_ici'),
('Hoca6', 'Tarih', 'YKS', 'Perşembe', '15:45', '17:15', 'YKS Hafta İçi Eşit Ağırlık 1', 'hafta_ici'),
('Hoca7', 'Coğrafya', 'YKS', 'Cuma', '14:00', '15:30', 'YKS Hafta İçi Eşit Ağırlık 1', 'hafta_ici'),
('Hoca8', 'Felsefe', 'YKS', 'Cuma', '15:45', '17:15', 'YKS Hafta İçi Eşit Ağırlık 1', 'hafta_ici'),

-- Hafta Sonu YKS
('Hoca9', 'Matematik', 'YKS', 'Cumartesi', '09:00', '10:30', 'YKS Hafta Sonu Sayısal 1', 'hafta_sonu'),
('Hoca10', 'Fizik', 'YKS', 'Cumartesi', '10:45', '12:15', 'YKS Hafta Sonu Sayısal 1', 'hafta_sonu'),
('Hoca11', 'Kimya', 'YKS', 'Cumartesi', '13:00', '14:30', 'YKS Hafta Sonu Sayısal 1', 'hafta_sonu'),
('Hoca12', 'Biyoloji', 'YKS', 'Cumartesi', '14:45', '16:15', 'YKS Hafta Sonu Sayısal 1', 'hafta_sonu'),
('Hoca13', 'Türkçe', 'YKS', 'Pazar', '09:00', '10:30', 'YKS Hafta Sonu Eşit Ağırlık 1', 'hafta_sonu'),
('Hoca14', 'Tarih', 'YKS', 'Pazar', '10:45', '12:15', 'YKS Hafta Sonu Eşit Ağırlık 1', 'hafta_sonu'),
('Hoca15', 'Coğrafya', 'YKS', 'Pazar', '13:00', '14:30', 'YKS Hafta Sonu Eşit Ağırlık 1', 'hafta_sonu'),
('Hoca16', 'Felsefe', 'YKS', 'Pazar', '14:45', '16:15', 'YKS Hafta Sonu Eşit Ağırlık 1', 'hafta_sonu');
