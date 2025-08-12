-- Create password_reset_codes table for handling password resets
CREATE TABLE IF NOT EXISTS password_reset_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_email ON password_reset_codes(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_code ON password_reset_codes(code);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_expires_at ON password_reset_codes(expires_at);

-- Add RLS policies
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage reset codes
CREATE POLICY "Service role can manage password reset codes" ON password_reset_codes
    FOR ALL USING (auth.role() = 'service_role');

-- Clean up expired codes (optional - can be run periodically)
-- DELETE FROM password_reset_codes WHERE expires_at < NOW() - INTERVAL '1 day';
