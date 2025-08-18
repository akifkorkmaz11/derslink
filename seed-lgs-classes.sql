-- LGS Sınıfları Seed Data - Yeni Program Yapısı (Haftalık 12 Ders Saati)

-- Önce mevcut LGS sınıflarını ve programlarını temizle
DELETE FROM class_schedules WHERE class_id IN (SELECT id FROM classes WHERE class_name LIKE 'LGS-%');
DELETE FROM classes WHERE class_name LIKE 'LGS-%';

-- LGS Hafta İçi Sınıfları
INSERT INTO classes (class_name, program_type, schedule_type, max_capacity, current_enrollment, status) VALUES
('LGS-A', 'LGS', 'hafta-ici', 5, 0, 'active'),
('LGS-B', 'LGS', 'hafta-ici', 5, 0, 'active'),
('LGS-C', 'LGS', 'hafta-ici', 5, 0, 'active'),
('LGS-D', 'LGS', 'hafta-ici', 5, 0, 'active');

-- LGS Hafta Sonu Sınıfları
INSERT INTO classes (class_name, program_type, schedule_type, max_capacity, current_enrollment, status) VALUES
('LGS-E', 'LGS', 'hafta-sonu', 5, 0, 'active'),
('LGS-F', 'LGS', 'hafta-sonu', 5, 0, 'active'),
('LGS-G', 'LGS', 'hafta-sonu', 5, 0, 'active'),
('LGS-H', 'LGS', 'hafta-sonu', 5, 0, 'active');

-- LGS Karma Sınıfları
INSERT INTO classes (class_name, program_type, schedule_type, max_capacity, current_enrollment, status) VALUES
('LGS-I', 'LGS', 'karma', 5, 0, 'active'),
('LGS-J', 'LGS', 'karma', 5, 0, 'active'),
('LGS-K', 'LGS', 'karma', 5, 0, 'active'),
('LGS-L', 'LGS', 'karma', 5, 0, 'active');

-- LGS-A Sınıfı Ders Programı (Hafta İçi) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '17:00', '17:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '17:50', '18:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '18:40', '19:20', 'Türkçe', 'Serhat Dede'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Salı', '17:00', '17:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Salı', '17:50', '18:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Salı', '18:40', '19:20', 'Türkçe', 'Serhat Dede'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '17:00', '17:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '17:50', '18:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '18:40', '19:20', 'Türkçe', 'Serhat Dede'),
-- Perşembe (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Perşembe', '17:00', '17:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Perşembe', '17:50', '18:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Perşembe', '18:40', '19:20', 'İngilizce', 'Sevde İrem Gidek');

-- LGS-B Sınıfı Ders Programı (Hafta İçi) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '18:00', '18:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '18:50', '19:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '19:40', '20:20', 'Türkçe', 'Ayşegül Karamık'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Salı', '18:00', '18:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Salı', '18:50', '19:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Salı', '19:40', '20:20', 'Türkçe', 'Ayşegül Karamık'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '18:00', '18:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '18:50', '19:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '19:40', '20:20', 'Türkçe', 'Ayşegül Karamık'),
-- Perşembe (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Perşembe', '18:00', '18:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Perşembe', '18:50', '19:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Perşembe', '19:40', '20:20', 'İngilizce', 'Sevde İrem Gidek');

-- LGS-C Sınıfı Ders Programı (Hafta İçi) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '19:00', '19:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '19:50', '20:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '20:40', '21:20', 'Türkçe', 'Serhat Dede'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Salı', '19:00', '19:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Salı', '19:50', '20:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Salı', '20:40', '21:20', 'Türkçe', 'Serhat Dede'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '19:00', '19:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '19:50', '20:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '20:40', '21:20', 'Türkçe', 'Serhat Dede'),
-- Perşembe (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Perşembe', '19:00', '19:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Perşembe', '19:50', '20:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Perşembe', '20:40', '21:20', 'İngilizce', 'Sevde İrem Gidek');

-- LGS-D Sınıfı Ders Programı (Hafta İçi) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '20:00', '20:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '20:50', '21:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '21:40', '22:20', 'Türkçe', 'Ayşegül Karamık'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Salı', '20:00', '20:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Salı', '20:50', '21:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Salı', '21:40', '22:20', 'Türkçe', 'Ayşegül Karamık'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '20:00', '20:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '20:50', '21:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '21:40', '22:20', 'Türkçe', 'Ayşegül Karamık'),
-- Perşembe (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Perşembe', '20:00', '20:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Perşembe', '20:50', '21:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Perşembe', '21:40', '22:20', 'İngilizce', 'Sevde İrem Gidek');

-- LGS-E Sınıfı Ders Programı (Hafta Sonu) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Cumartesi (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '09:00', '09:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '09:50', '10:30', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '10:40', '11:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '11:30', '12:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '12:20', '13:00', 'Türkçe', 'Serhat Dede'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '13:10', '13:50', 'Türkçe', 'Serhat Dede'),
-- Pazar (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '09:00', '09:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '09:50', '10:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '10:40', '11:20', 'İngilizce', 'Sevde İrem Gidek'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '11:30', '12:10', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '12:20', '13:00', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '13:10', '13:50', 'Türkçe', 'Serhat Dede');

-- LGS-F Sınıfı Ders Programı (Hafta Sonu) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Cumartesi (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '10:00', '10:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '10:50', '11:30', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '11:40', '12:20', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '12:30', '13:10', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '13:20', '14:00', 'Türkçe', 'Ayşegül Karamık'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '14:10', '14:50', 'Türkçe', 'Ayşegül Karamık'),
-- Pazar (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '10:00', '10:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '10:50', '11:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '11:40', '12:20', 'İngilizce', 'Sevde İrem Gidek'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '12:30', '13:10', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '13:20', '14:00', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '14:10', '14:50', 'Türkçe', 'Ayşegül Karamık');

-- LGS-G Sınıfı Ders Programı (Hafta Sonu) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Cumartesi (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '11:00', '11:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '11:50', '12:30', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '12:40', '13:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '13:30', '14:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '14:20', '15:00', 'Türkçe', 'Serhat Dede'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '15:10', '15:50', 'Türkçe', 'Serhat Dede'),
-- Pazar (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '11:00', '11:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '11:50', '12:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '12:40', '13:20', 'İngilizce', 'Sevde İrem Gidek'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '13:30', '14:10', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '14:20', '15:00', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '15:10', '15:50', 'Türkçe', 'Serhat Dede');

-- LGS-H Sınıfı Ders Programı (Hafta Sonu) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Cumartesi (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '12:00', '12:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '12:50', '13:30', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '13:40', '14:20', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '14:30', '15:10', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '15:20', '16:00', 'Türkçe', 'Ayşegül Karamık'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '16:10', '16:50', 'Türkçe', 'Ayşegül Karamık'),
-- Pazar (6 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '12:00', '12:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '12:50', '13:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '13:40', '14:20', 'İngilizce', 'Sevde İrem Gidek'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '14:30', '15:10', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '15:20', '16:00', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '16:10', '16:50', 'Türkçe', 'Ayşegül Karamık');

-- LGS-I Sınıfı Ders Programı (Karma) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '17:00', '17:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '17:50', '18:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '18:40', '19:20', 'Türkçe', 'Ayşegül Karamık'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Salı', '17:00', '17:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Salı', '17:50', '18:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Salı', '18:40', '19:20', 'Türkçe', 'Ayşegül Karamık'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '17:00', '17:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '17:50', '18:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '18:40', '19:20', 'İngilizce', 'Sevde İrem Gidek'),
-- Cumartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '09:00', '09:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '09:50', '10:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '10:40', '11:20', 'Türkçe', 'Ayşegül Karamık');

-- LGS-J Sınıfı Ders Programı (Karma) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazartesi', '18:00', '18:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazartesi', '18:50', '19:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazartesi', '19:40', '20:20', 'Türkçe', 'Serhat Dede'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '18:00', '18:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '18:50', '19:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '19:40', '20:20', 'Türkçe', 'Serhat Dede'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Çarşamba', '18:00', '18:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Çarşamba', '18:50', '19:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Çarşamba', '19:40', '20:20', 'İngilizce', 'Sevde İrem Gidek'),
-- Cumartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Cumartesi', '10:00', '10:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Cumartesi', '10:50', '11:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Cumartesi', '11:40', '12:20', 'Türkçe', 'Serhat Dede');

-- LGS-K Sınıfı Ders Programı (Karma) - Yasin Karakaş (Matematik), Kağan Şahin (Fen), Ayşegül Karamık (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Pazartesi', '19:00', '19:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Pazartesi', '19:50', '20:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Pazartesi', '20:40', '21:20', 'Türkçe', 'Ayşegül Karamık'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '19:00', '19:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '19:50', '20:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '20:40', '21:20', 'Türkçe', 'Ayşegül Karamık'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Çarşamba', '19:00', '19:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Çarşamba', '19:50', '20:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Çarşamba', '20:40', '21:20', 'İngilizce', 'Sevde İrem Gidek'),
-- Cumartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '11:00', '11:40', 'Matematik', 'Yasin Karakaş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '11:50', '12:30', 'Fen Bilgisi', 'Kağan Şahin'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '12:40', '13:20', 'Türkçe', 'Ayşegül Karamık');

-- LGS-L Sınıfı Ders Programı (Karma) - Zeynep Sarı (Matematik), Zülküf Memiş (Fen), Serhat Dede (Türkçe)
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
-- Pazartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazartesi', '20:00', '20:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazartesi', '20:50', '21:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazartesi', '21:40', '22:20', 'Türkçe', 'Serhat Dede'),
-- Salı (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '20:00', '20:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '20:50', '21:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '21:40', '22:20', 'Türkçe', 'Serhat Dede'),
-- Çarşamba (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Çarşamba', '20:00', '20:40', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Çarşamba', '20:50', '21:30', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Çarşamba', '21:40', '22:20', 'İngilizce', 'Sevde İrem Gidek'),
-- Cumartesi (3 ders)
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Cumartesi', '12:00', '12:40', 'Matematik', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Cumartesi', '12:50', '13:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Cumartesi', '13:40', '14:20', 'Türkçe', 'Serhat Dede');

