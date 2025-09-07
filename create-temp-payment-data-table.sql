-- Geçici payment data tablosu oluştur
CREATE TABLE IF NOT EXISTS temp_payment_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    main_program VARCHAR(50) NOT NULL,
    sub_program VARCHAR(50) NOT NULL,
    program_title TEXT,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_temp_payment_data_conversation_id ON temp_payment_data(conversation_id);
CREATE INDEX IF NOT EXISTS idx_temp_payment_data_expires_at ON temp_payment_data(expires_at);

-- Expired kayıtları temizlemek için function
CREATE OR REPLACE FUNCTION cleanup_expired_temp_payment_data()
RETURNS void AS $$
BEGIN
    DELETE FROM temp_payment_data WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
