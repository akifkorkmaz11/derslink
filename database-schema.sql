-- Derslink Sistemi Veritabanı Şeması (LGS + YKS)

-- Kullanıcılar tablosu (Supabase Auth ile entegre)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    enrolled_program VARCHAR(10) DEFAULT 'LGS', -- 'LGS', 'YKS'
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğretmenler tablosu
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

-- Sınıflar tablosu
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(100) NOT NULL UNIQUE,
    program_type VARCHAR(20) NOT NULL, -- 'LGS', 'YKS'
    schedule_type VARCHAR(20) NOT NULL, -- 'hafta-ici', 'hafta-sonu', 'karma'
    program VARCHAR(10) NOT NULL, -- 'LGS', 'YKS'
    max_students INTEGER DEFAULT 25,
    current_enrollment INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'full'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sınıf ders programları tablosu
CREATE TABLE IF NOT EXISTS class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    teacher_name VARCHAR(100) NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id),
    subject VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    program VARCHAR(10) NOT NULL, -- 'LGS', 'YKS'
    room_number VARCHAR(10) DEFAULT 'Online',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenci-sınıf kayıtları tablosu
CREATE TABLE IF NOT EXISTS class_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, class_id)
);

-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ders değişiklikleri tablosu
CREATE TABLE IF NOT EXISTS schedule_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    original_schedule_id UUID REFERENCES class_schedules(id) ON DELETE CASCADE,
    change_type VARCHAR(20) NOT NULL,
    original_day VARCHAR(20),
    original_start_time TIME,
    original_end_time TIME,
    original_teacher VARCHAR(100),
    new_day VARCHAR(20),
    new_start_time TIME,
    new_end_time TIME,
    new_teacher VARCHAR(100),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödemeler tablosu
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_enrolled_program ON users(enrolled_program);
CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers(name);
CREATE INDEX IF NOT EXISTS idx_teachers_specialties ON teachers(specialties);
CREATE INDEX IF NOT EXISTS idx_classes_program_type ON classes(program_type);
CREATE INDEX IF NOT EXISTS idx_classes_program ON classes(program);
CREATE INDEX IF NOT EXISTS idx_classes_schedule_type ON classes(schedule_type);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_program ON class_schedules(program);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON class_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_user_id ON class_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_changes_class_id ON schedule_changes(class_id);
CREATE INDEX IF NOT EXISTS idx_schedule_changes_status ON schedule_changes(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Sınıf kapasitesi güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_class_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE classes SET current_enrollment = current_enrollment + 1 WHERE id = NEW.class_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE classes SET current_enrollment = current_enrollment - 1 WHERE id = OLD.class_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_schedules_updated_at BEFORE UPDATE ON class_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sınıf enrollment sayısını güncellemek için RPC fonksiyonu
CREATE OR REPLACE FUNCTION update_class_enrollment_count(class_id UUID)
RETURNS INTEGER AS $$
DECLARE
    enrollment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO enrollment_count
    FROM class_enrollments
    WHERE class_enrollments.class_id = update_class_enrollment_count.class_id
    AND class_enrollments.status = 'active';
    
    RETURN enrollment_count;
END;
$$ LANGUAGE plpgsql;

-- class_enrollments tablosu değiştiğinde sınıf enrollment sayısını güncelle
CREATE OR REPLACE FUNCTION update_class_enrollment_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Eski kayıt varsa eski sınıfın enrollment sayısını güncelle
    IF TG_OP = 'UPDATE' AND OLD.class_id IS NOT NULL THEN
        UPDATE classes 
        SET current_enrollment = (
            SELECT COUNT(*) 
            FROM class_enrollments 
            WHERE class_id = OLD.class_id AND status = 'active'
        )
        WHERE id = OLD.class_id;
    END IF;
    
    -- Yeni kayıt için sınıfın enrollment sayısını güncelle
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.class_id IS NOT NULL) THEN
        UPDATE classes 
        SET current_enrollment = (
            SELECT COUNT(*) 
            FROM class_enrollments 
            WHERE class_id = NEW.class_id AND status = 'active'
        )
        WHERE id = NEW.class_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı class_enrollments tablosuna ekle
DROP TRIGGER IF EXISTS update_class_enrollment_trigger ON class_enrollments;
CREATE TRIGGER update_class_enrollment_trigger
    AFTER INSERT OR UPDATE OR DELETE ON class_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_class_enrollment_trigger();

