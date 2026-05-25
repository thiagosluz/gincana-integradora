CREATE TABLE login_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster IP queries over time
CREATE INDEX idx_login_attempts_ip_created_at ON login_attempts(ip_address, created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can do anything" ON login_attempts
FOR ALL USING (auth.role() = 'service_role');
