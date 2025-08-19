-- Pending Enrollments Table
-- Yeni kayıt olan öğrenciler için bekleme listesi

CREATE TABLE IF NOT EXISTS pending_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    main_program VARCHAR(10) NOT NULL, -- YKS/LGS
    schedule_type VARCHAR(20) NOT NULL, -- hafta-ici/hafta-sonu/karma
    yks_field VARCHAR(20), -- sayisal/sozel/esit-agirlik (sadece YKS için)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending', -- pending/assigned/cancelled
    notes TEXT -- Admin notları
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pending_enrollments_user_id ON pending_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_enrollments_status ON pending_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_pending_enrollments_main_program ON pending_enrollments(main_program);

-- RLS Policies
ALTER TABLE pending_enrollments ENABLE ROW LEVEL SECURITY;

-- Admin can read all pending enrollments
CREATE POLICY "Admin can read all pending enrollments" ON pending_enrollments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Admin can insert pending enrollments
CREATE POLICY "Admin can insert pending enrollments" ON pending_enrollments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admin can update pending enrollments
CREATE POLICY "Admin can update pending enrollments" ON pending_enrollments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin can delete pending enrollments
CREATE POLICY "Admin can delete pending enrollments" ON pending_enrollments
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pending_enrollments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_pending_enrollments_updated_at
    BEFORE UPDATE ON pending_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_pending_enrollments_updated_at();
