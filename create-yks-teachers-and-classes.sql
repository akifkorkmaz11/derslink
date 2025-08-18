-- YKS Sistemi Kurulum Dosyası
-- Bu dosya YKS öğretmenlerini, sınıflarını ve ders programlarını oluşturur

-- 1. YKS Öğretmenlerini Ekle
INSERT INTO teachers (name, branch, specialties, initial, status, zoom_link) VALUES
('Hoca1', 'TYT Matematik', 'TYT, Matematik', 'H1', 'active', 'https://zoom.us/j/111111111'),
('Hoca2', 'TYT Matematik', 'TYT, Matematik', 'H2', 'active', 'https://zoom.us/j/222222222'),
('Hoca3', 'AYT Matematik', 'AYT, Matematik', 'H3', 'active', 'https://zoom.us/j/333333333'),
('Hoca4', 'AYT Matematik', 'AYT, Matematik', 'H4', 'active', 'https://zoom.us/j/444444444'),
('Hoca5', 'AYT Matematik', 'AYT, Matematik', 'H5', 'active', 'https://zoom.us/j/555555555'),
('Hoca6', 'Fizik', 'TYT, AYT, Fizik', 'H6', 'active', 'https://zoom.us/j/666666666'),
('Hoca7', 'Fizik', 'TYT, AYT, Fizik', 'H7', 'active', 'https://zoom.us/j/777777777'),
('Hoca8', 'Fizik', 'TYT, AYT, Fizik', 'H8', 'active', 'https://zoom.us/j/888888888'),
('Hoca9', 'Kimya', 'TYT, AYT, Kimya', 'H9', 'active', 'https://zoom.us/j/999999999'),
('Hoca10', 'Kimya', 'TYT, AYT, Kimya', 'H10', 'active', 'https://zoom.us/j/101010101'),
('Hoca11', 'Biyoloji', 'TYT, AYT, Biyoloji', 'H11', 'active', 'https://zoom.us/j/111111112'),
('Hoca12', 'Biyoloji', 'TYT, AYT, Biyoloji', 'H12', 'active', 'https://zoom.us/j/121212121'),
('Hoca13', 'Edebiyat', 'AYT, Edebiyat', 'H13', 'active', 'https://zoom.us/j/131313131'),
('Hoca14', 'Coğrafya', 'TYT, AYT, Coğrafya', 'H14', 'active', 'https://zoom.us/j/141414141'),
('Hoca15', 'Tarih', 'TYT, AYT, Tarih', 'H15', 'active', 'https://zoom.us/j/151515151'),
('Hoca16', 'Felsefe', 'TYT, AYT, Felsefe', 'H16', 'active', 'https://zoom.us/j/161616161')
ON CONFLICT (name) DO NOTHING;

-- 2. YKS Sınıflarını Ekle
INSERT INTO classes (class_name, program_type, schedule_type, program, max_students, status, description) VALUES
-- Hafta İçi Sınıfları (4 sınıf: 3 Sayısal + 1 Eşit Ağırlık)
('YKS Hafta İçi Sayısal 1', 'Sayısal', 'hafta_ici', 'YKS', 25, 'active', 'YKS Hafta İçi Sayısal Sınıfı'),
('YKS Hafta İçi Sayısal 2', 'Sayısal', 'hafta_ici', 'YKS', 25, 'active', 'YKS Hafta İçi Sayısal Sınıfı'),
('YKS Hafta İçi Sayısal 3', 'Sayısal', 'hafta_ici', 'YKS', 25, 'active', 'YKS Hafta İçi Sayısal Sınıfı'),
('YKS Hafta İçi Eşit Ağırlık 1', 'Eşit Ağırlık', 'hafta_ici', 'YKS', 25, 'active', 'YKS Hafta İçi Eşit Ağırlık Sınıfı'),

-- Hafta Sonu Sınıfları (4 sınıf: 2 Sayısal + 1 Eşit Ağırlık + 1 Sözel)
('YKS Hafta Sonu Sayısal 1', 'Sayısal', 'hafta_sonu', 'YKS', 25, 'active', 'YKS Hafta Sonu Sayısal Sınıfı'),
('YKS Hafta Sonu Sayısal 2', 'Sayısal', 'hafta_sonu', 'YKS', 25, 'active', 'YKS Hafta Sonu Sayısal Sınıfı'),
('YKS Hafta Sonu Eşit Ağırlık 1', 'Eşit Ağırlık', 'hafta_sonu', 'YKS', 25, 'active', 'YKS Hafta Sonu Eşit Ağırlık Sınıfı'),
('YKS Hafta Sonu Sözel 1', 'Sözel', 'hafta_sonu', 'YKS', 25, 'active', 'YKS Hafta Sonu Sözel Sınıfı'),

-- Karma Sınıfları (4 sınıf: 2 Sayısal + 1 Eşit Ağırlık + 1 Sözel)
('YKS Karma Sayısal 1', 'Sayısal', 'karma', 'YKS', 25, 'active', 'YKS Karma Sayısal Sınıfı'),
('YKS Karma Sayısal 2', 'Sayısal', 'karma', 'YKS', 25, 'active', 'YKS Karma Sayısal Sınıfı'),
('YKS Karma Eşit Ağırlık 1', 'Eşit Ağırlık', 'karma', 'YKS', 25, 'active', 'YKS Karma Eşit Ağırlık Sınıfı'),
('YKS Karma Sözel 1', 'Sözel', 'karma', 'YKS', 25, 'active', 'YKS Karma Sözel Sınıfı')
ON CONFLICT (class_name) DO NOTHING;

-- 3. YKS Ders Programlarını Oluştur
-- Önce mevcut YKS programlarını temizle
DELETE FROM class_schedules WHERE program = 'YKS';

-- YKS Hafta İçi Sayısal 1 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca3', 'AYT Matematik', 'Pazartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca6', 'Fizik', 'Pazartesi', '13:30', '15:00', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca2', 'TYT Matematik', 'Salı', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca4', 'AYT Matematik', 'Salı', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca7', 'Fizik', 'Salı', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca9', 'Kimya', 'Salı', '15:15', '16:45', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca5', 'AYT Matematik', 'Çarşamba', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca8', 'Fizik', 'Çarşamba', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca10', 'Kimya', 'Çarşamba', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca11', 'Biyoloji', 'Çarşamba', '15:15', '16:45', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca12', 'Biyoloji', 'Perşembe', '09:00', '10:30', 'YKS'),

-- Cuma
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 1'), 'Hoca3', 'AYT Matematik', 'Cuma', '09:00', '10:30', 'YKS');

-- YKS Hafta İçi Eşit Ağırlık 1 - 2 TYT Matematik, 2 AYT Matematik, 2 Edebiyat, 1 Coğrafya, 1 Tarih, 1 Felsefe, 1 Kimya, 1 Fizik, 1 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Pazartesi', '20:45', '22:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca2', 'TYT Matematik', 'Salı', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca3', 'AYT Matematik', 'Salı', '20:45', '22:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Çarşamba', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca14', 'Coğrafya', 'Çarşamba', '20:45', '22:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca4', 'AYT Matematik', 'Perşembe', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca15', 'Tarih', 'Perşembe', '20:45', '22:15', 'YKS'),

-- Cuma
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca16', 'Felsefe', 'Cuma', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca9', 'Kimya', 'Cuma', '20:45', '22:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca6', 'Fizik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Eşit Ağırlık 1'), 'Hoca11', 'Biyoloji', 'Cumartesi', '10:45', '12:15', 'YKS');

-- YKS Hafta Sonu Sayısal 1 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca1', 'TYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca3', 'AYT Matematik', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca6', 'Fizik', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca9', 'Kimya', 'Cumartesi', '15:15', '16:45', 'YKS'),

-- Pazar
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca2', 'TYT Matematik', 'Pazar', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca4', 'AYT Matematik', 'Pazar', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca7', 'Fizik', 'Pazar', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca10', 'Kimya', 'Pazar', '15:15', '16:45', 'YKS'),

-- Cumartesi (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca5', 'AYT Matematik', 'Cumartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca8', 'Fizik', 'Cumartesi', '20:45', '22:15', 'YKS'),

-- Pazar (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca11', 'Biyoloji', 'Pazar', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 1'), 'Hoca12', 'Biyoloji', 'Pazar', '20:45', '22:15', 'YKS');

-- YKS Hafta Sonu Sözel 1 - 2 TYT Matematik, 2 Edebiyat, 2 Coğrafya, 2 Tarih, 1 Felsefe, 1 Fizik, 1 Kimya, 1 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca1', 'TYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca13', 'Edebiyat', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca14', 'Coğrafya', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca15', 'Tarih', 'Cumartesi', '15:15', '16:45', 'YKS'),

-- Pazar
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca2', 'TYT Matematik', 'Pazar', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca13', 'Edebiyat', 'Pazar', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca14', 'Coğrafya', 'Pazar', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca15', 'Tarih', 'Pazar', '15:15', '16:45', 'YKS'),

-- Cumartesi (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca16', 'Felsefe', 'Cumartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca6', 'Fizik', 'Cumartesi', '20:45', '22:15', 'YKS'),

-- Pazar (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca9', 'Kimya', 'Pazar', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sözel 1'), 'Hoca11', 'Biyoloji', 'Pazar', '20:45', '22:15', 'YKS');

-- YKS Hafta İçi Sayısal 2 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca2', 'TYT Matematik', 'Pazartesi', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca5', 'AYT Matematik', 'Pazartesi', '15:45', '17:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca8', 'Fizik', 'Pazartesi', '18:30', '20:00', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca1', 'TYT Matematik', 'Salı', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca3', 'AYT Matematik', 'Salı', '15:45', '17:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca6', 'Fizik', 'Salı', '18:30', '20:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca10', 'Kimya', 'Salı', '20:15', '21:45', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca4', 'AYT Matematik', 'Çarşamba', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca7', 'Fizik', 'Çarşamba', '15:45', '17:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca9', 'Kimya', 'Çarşamba', '18:30', '20:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca11', 'Biyoloji', 'Çarşamba', '20:15', '21:45', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca12', 'Biyoloji', 'Perşembe', '14:00', '15:30', 'YKS'),

-- Cuma
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 2'), 'Hoca5', 'AYT Matematik', 'Cuma', '14:00', '15:30', 'YKS');

-- YKS Hafta Sonu Sayısal 2 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca2', 'TYT Matematik', 'Cumartesi', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca5', 'AYT Matematik', 'Cumartesi', '15:45', '17:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca8', 'Fizik', 'Cumartesi', '18:30', '20:00', 'YKS'),

-- Pazar
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca1', 'TYT Matematik', 'Pazar', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca3', 'AYT Matematik', 'Pazar', '15:45', '17:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca6', 'Fizik', 'Pazar', '18:30', '20:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca10', 'Kimya', 'Pazar', '20:15', '21:45', 'YKS'),

-- Cumartesi (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca4', 'AYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca7', 'Fizik', 'Cumartesi', '10:45', '12:15', 'YKS'),

-- Pazar (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca9', 'Kimya', 'Pazar', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca11', 'Biyoloji', 'Pazar', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Sayısal 2'), 'Hoca12', 'Biyoloji', 'Pazar', '13:30', '15:00', 'YKS');

-- YKS Hafta Sonu Eşit Ağırlık 1 - 2 TYT Matematik, 2 AYT Matematik, 2 Edebiyat, 1 Coğrafya, 1 Tarih, 1 Felsefe, 1 Kimya, 1 Fizik, 1 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca1', 'TYT Matematik', 'Cumartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Cumartesi', '20:45', '22:15', 'YKS'),

-- Pazar
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca2', 'TYT Matematik', 'Pazar', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca3', 'AYT Matematik', 'Pazar', '20:45', '22:15', 'YKS'),

-- Cumartesi (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca14', 'Coğrafya', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca4', 'AYT Matematik', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca15', 'Tarih', 'Cumartesi', '15:15', '16:45', 'YKS'),

-- Pazar (2. hafta)
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca16', 'Felsefe', 'Pazar', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca9', 'Kimya', 'Pazar', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca6', 'Fizik', 'Pazar', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta Sonu Eşit Ağırlık 1'), 'Hoca11', 'Biyoloji', 'Pazar', '15:15', '16:45', 'YKS');

-- YKS Karma Sayısal 1 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca3', 'AYT Matematik', 'Pazartesi', '20:45', '22:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca6', 'Fizik', 'Salı', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca9', 'Kimya', 'Salı', '20:45', '22:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca2', 'TYT Matematik', 'Çarşamba', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca4', 'AYT Matematik', 'Çarşamba', '20:45', '22:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca8', 'Fizik', 'Perşembe', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca11', 'Biyoloji', 'Perşembe', '20:45', '22:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca5', 'AYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca7', 'Fizik', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca10', 'Kimya', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 1'), 'Hoca12', 'Biyoloji', 'Cumartesi', '15:15', '16:45', 'YKS');

-- YKS Karma Eşit Ağırlık 1 - 2 TYT Matematik, 2 AYT Matematik, 2 Edebiyat, 1 Coğrafya, 1 Tarih, 1 Felsefe, 1 Kimya, 1 Fizik, 1 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca3', 'AYT Matematik', 'Pazartesi', '15:45', '17:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Salı', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca14', 'Coğrafya', 'Salı', '15:45', '17:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca2', 'TYT Matematik', 'Çarşamba', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca4', 'AYT Matematik', 'Çarşamba', '15:45', '17:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca15', 'Tarih', 'Perşembe', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca16', 'Felsefe', 'Perşembe', '15:45', '17:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca5', 'AYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca13', 'Edebiyat', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca9', 'Kimya', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca6', 'Fizik', 'Cumartesi', '15:15', '16:45', 'YKS'),

-- Pazar
((SELECT id FROM classes WHERE class_name = 'YKS Karma Eşit Ağırlık 1'), 'Hoca11', 'Biyoloji', 'Pazar', '09:00', '10:30', 'YKS');

-- YKS Karma Sözel 1 - 2 TYT Matematik, 2 Edebiyat, 2 Coğrafya, 2 Tarih, 1 Felsefe, 1 Fizik, 1 Kimya, 1 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca13', 'Edebiyat', 'Pazartesi', '15:45', '17:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca14', 'Coğrafya', 'Salı', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca15', 'Tarih', 'Salı', '15:45', '17:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca2', 'TYT Matematik', 'Çarşamba', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca16', 'Felsefe', 'Çarşamba', '15:45', '17:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca6', 'Fizik', 'Perşembe', '14:00', '15:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca9', 'Kimya', 'Perşembe', '15:45', '17:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca13', 'Edebiyat', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca14', 'Coğrafya', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca15', 'Tarih', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sözel 1'), 'Hoca11', 'Biyoloji', 'Cumartesi', '15:15', '16:45', 'YKS');

-- YKS Hafta İçi Sayısal 3 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca1', 'TYT Matematik', 'Pazartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca3', 'AYT Matematik', 'Pazartesi', '20:45', '22:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca2', 'TYT Matematik', 'Salı', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca4', 'AYT Matematik', 'Salı', '20:45', '22:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca5', 'AYT Matematik', 'Çarşamba', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca6', 'Fizik', 'Çarşamba', '20:45', '22:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca7', 'Fizik', 'Perşembe', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca8', 'Fizik', 'Perşembe', '20:45', '22:15', 'YKS'),

-- Cuma
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca9', 'Kimya', 'Cuma', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca10', 'Kimya', 'Cuma', '20:45', '22:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca11', 'Biyoloji', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Hafta İçi Sayısal 3'), 'Hoca12', 'Biyoloji', 'Cumartesi', '10:45', '12:15', 'YKS');

-- YKS Karma Sayısal 2 - 2 TYT Matematik, 3 AYT Matematik, 3 Fizik, 2 Kimya, 2 Biyoloji (12 ders)
INSERT INTO class_schedules (class_id, teacher_name, subject, day_of_week, start_time, end_time, program) VALUES
-- Pazartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca2', 'TYT Matematik', 'Pazartesi', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca4', 'AYT Matematik', 'Pazartesi', '20:45', '22:15', 'YKS'),

-- Salı
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca7', 'Fizik', 'Salı', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca10', 'Kimya', 'Salı', '20:45', '22:15', 'YKS'),

-- Çarşamba
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca1', 'TYT Matematik', 'Çarşamba', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca3', 'AYT Matematik', 'Çarşamba', '20:45', '22:15', 'YKS'),

-- Perşembe
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca6', 'Fizik', 'Perşembe', '19:00', '20:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca12', 'Biyoloji', 'Perşembe', '20:45', '22:15', 'YKS'),

-- Cumartesi
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca5', 'AYT Matematik', 'Cumartesi', '09:00', '10:30', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca8', 'Fizik', 'Cumartesi', '10:45', '12:15', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca9', 'Kimya', 'Cumartesi', '13:30', '15:00', 'YKS'),
((SELECT id FROM classes WHERE class_name = 'YKS Karma Sayısal 2'), 'Hoca11', 'Biyoloji', 'Cumartesi', '15:15', '16:45', 'YKS');

-- 4. Öğretmen ID'lerini güncelle
UPDATE class_schedules 
SET teacher_id = t.id 
FROM teachers t 
WHERE class_schedules.teacher_name = t.name 
AND class_schedules.teacher_id IS NULL;
