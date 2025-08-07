-- Add password_hash column to profiles table for secure password storage
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create APIs table for custom API management
CREATE TABLE IF NOT EXISTS apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  api_key TEXT NOT NULL UNIQUE,
  requests_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API analytics table
CREATE TABLE IF NOT EXISTS api_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_id UUID REFERENCES apis(id) ON DELETE CASCADE,
  request_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apis_user_id ON apis(user_id);
CREATE INDEX IF NOT EXISTS idx_apis_api_key ON apis(api_key);
CREATE INDEX IF NOT EXISTS idx_api_analytics_api_id ON api_analytics(api_id);
CREATE INDEX IF NOT EXISTS idx_api_analytics_date ON api_analytics(date);

-- Enable RLS (Row Level Security)
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own APIs" ON apis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own APIs" ON apis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own APIs" ON apis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own APIs" ON apis
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view analytics for their APIs" ON api_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM apis 
      WHERE apis.id = api_analytics.api_id 
      AND apis.user_id = auth.uid()
    )
  );
