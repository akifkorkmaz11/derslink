-- LGS Sınıf Sistemi Seed Data
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Önce mevcut class_schedules verilerini temizle
DELETE FROM class_schedules;

-- LGS-A (Hafta İçi) - Pazartesi, Çarşamba, Cuma
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '16:00', '16:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '16:50', '17:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '17:40', '18:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Pazartesi', '18:30', '19:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '16:00', '16:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '16:50', '17:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Çarşamba', '17:40', '18:20', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Cuma', '16:00', '16:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Cuma', '16:50', '17:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Cuma', '17:40', '18:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Cuma', '18:30', '19:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-A'), 'Cuma', '19:20', '20:00', 'Din Kültürü', 'İshak Bilgin');

-- LGS-B (Hafta İçi) - Pazartesi, Çarşamba, Cuma
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '16:00', '16:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '17:40', '18:20', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Pazartesi', '18:30', '19:10', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '16:00', '16:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Çarşamba', '17:40', '18:20', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Cuma', '16:00', '16:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Cuma', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Cuma', '17:40', '18:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Cuma', '18:30', '19:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-B'), 'Cuma', '19:20', '20:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- LGS-C (Hafta İçi) - Pazartesi, Çarşamba, Cuma
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '16:00', '16:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '17:40', '18:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Pazartesi', '18:30', '19:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '16:00', '16:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Çarşamba', '17:40', '18:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Cuma', '16:00', '16:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Cuma', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Cuma', '17:40', '18:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Cuma', '18:30', '19:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-C'), 'Cuma', '19:20', '20:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- LGS-D (Hafta İçi) - Pazartesi, Çarşamba, Cuma
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '16:00', '16:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '16:50', '17:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '17:40', '18:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Pazartesi', '18:30', '19:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '16:00', '16:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '16:50', '17:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Çarşamba', '17:40', '18:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Cuma', '16:00', '16:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Cuma', '16:50', '17:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Cuma', '17:40', '18:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Cuma', '18:30', '19:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-D'), 'Cuma', '19:20', '20:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- LGS-E (Hafta Sonu) - Cumartesi, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '09:00', '09:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '09:50', '10:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '10:40', '11:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '11:30', '12:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Cumartesi', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '09:00', '09:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '09:50', '10:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '10:40', '11:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '11:30', '12:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '13:10', '13:50', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-E'), 'Pazar', '14:00', '14:40', 'Fen Bilgisi', 'Zülküf Memiş');

-- LGS-F (Hafta Sonu) - Cumartesi, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '09:00', '09:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '10:40', '11:20', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '11:30', '12:10', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Cumartesi', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '09:00', '09:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '10:40', '11:20', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '11:30', '12:10', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '13:10', '13:50', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-F'), 'Pazar', '14:00', '14:40', 'Matematik', 'Yusuf Cangat Altınışık');

-- LGS-G (Hafta Sonu) - Cumartesi, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '09:00', '09:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '10:40', '11:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '11:30', '12:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Cumartesi', '12:20', '13:00', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '09:00', '09:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '10:40', '11:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '11:30', '12:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '12:20', '13:00', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '13:10', '13:50', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-G'), 'Pazar', '14:00', '14:40', 'Matematik', 'Yusuf Cangat Altınışık');

-- LGS-H (Hafta Sonu) - Cumartesi, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '09:00', '09:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '09:50', '10:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '10:40', '11:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '11:30', '12:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Cumartesi', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '09:00', '09:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '09:50', '10:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '10:40', '11:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '11:30', '12:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '13:10', '13:50', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-H'), 'Pazar', '14:00', '14:40', 'Türkçe', 'Zeynep Sarı');

-- LGS-I (Karma) - Pazartesi, Çarşamba, Cumartesi
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '16:00', '16:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '16:50', '17:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '17:40', '18:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Pazartesi', '18:30', '19:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '16:00', '16:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '16:50', '17:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Çarşamba', '17:40', '18:20', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '09:00', '09:40', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '09:50', '10:30', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '10:40', '11:20', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '11:30', '12:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-I'), 'Cumartesi', '12:20', '13:00', 'Din Kültürü', 'İshak Bilgin');

-- LGS-J (Karma) - Salı, Perşembe, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '16:00', '16:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '17:40', '18:20', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Salı', '18:30', '19:10', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Perşembe', '16:00', '16:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Perşembe', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Perşembe', '17:40', '18:20', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazar', '09:00', '09:40', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazar', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazar', '10:40', '11:20', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazar', '11:30', '12:10', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-J'), 'Pazar', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- LGS-K (Karma) - Salı, Perşembe, Cumartesi
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '16:00', '16:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '17:40', '18:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Salı', '18:30', '19:10', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Perşembe', '16:00', '16:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Perşembe', '16:50', '17:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Perşembe', '17:40', '18:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '09:00', '09:40', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '09:50', '10:30', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '10:40', '11:20', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '11:30', '12:10', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-K'), 'Cumartesi', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- LGS-L (Karma) - Salı, Perşembe, Pazar
INSERT INTO class_schedules (class_id, day_of_week, start_time, end_time, subject, teacher_name) VALUES
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '16:00', '16:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '16:50', '17:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '17:40', '18:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Salı', '18:30', '19:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Perşembe', '16:00', '16:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Perşembe', '16:50', '17:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Perşembe', '17:40', '18:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazar', '09:00', '09:40', 'Din Kültürü', 'İshak Bilgin'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazar', '09:50', '10:30', 'Türkçe', 'Zeynep Sarı'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazar', '10:40', '11:20', 'Matematik', 'Yusuf Cangat Altınışık'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazar', '11:30', '12:10', 'Fen Bilgisi', 'Zülküf Memiş'),
((SELECT id FROM classes WHERE class_name = 'LGS-L'), 'Pazar', '12:20', '13:00', 'T.C. İnkılap Tarihi', 'Menekşe Nur Sucu');

-- Kontrol sorgusu
SELECT 
    c.class_name,
    c.schedule_type,
    COUNT(cs.id) as lesson_count,
    STRING_AGG(cs.subject || ' (' || cs.day_of_week || ' ' || cs.start_time || ')', ', ' ORDER BY cs.day_of_week, cs.start_time) as lessons
FROM classes c
LEFT JOIN class_schedules cs ON c.id = cs.class_id
GROUP BY c.class_name, c.schedule_type
ORDER BY c.class_name;
