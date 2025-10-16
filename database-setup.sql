-- Alexzo Database Setup Script
-- This script sets up the complete database schema for the Alexzo platform
-- Run this script in your Supabase SQL editor to initialize the database

-- ============================================================================
-- 1. PROFILES TABLE - User authentication and profile data
-- ============================================================================

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    '/images/avatars/user-' || (floor(random() * 5) + 1)::text || '.png',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 2. DATA COLLECTION TABLES - Newsletter, Waitlist, Contact
-- ============================================================================

-- Create newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'website',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waitlist submissions table  
CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  product VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  use_case TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. API MANAGEMENT TABLES - Custom APIs and Analytics
-- ============================================================================

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

-- ============================================================================
-- 4. PASSWORD RESET SYSTEM
-- ============================================================================

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

-- ============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all data tables
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_codes ENABLE ROW LEVEL SECURITY;

-- Data collection policies (allow public inserts)
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow waitlist submissions" ON waitlist_submissions  
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- API management policies (user-specific access)
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

-- Password reset policies (service role access)
CREATE POLICY "Service role can manage password reset codes" ON password_reset_codes
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 6. PERFORMANCE INDEXES
-- ============================================================================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscriptions(created_at);

-- Waitlist indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_submissions(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_submissions(created_at);

-- Contact indexes
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

-- API management indexes
CREATE INDEX IF NOT EXISTS idx_apis_user_id ON apis(user_id);
CREATE INDEX IF NOT EXISTS idx_apis_api_key ON apis(api_key);
CREATE INDEX IF NOT EXISTS idx_api_analytics_api_id ON api_analytics(api_id);
CREATE INDEX IF NOT EXISTS idx_api_analytics_date ON api_analytics(date);

-- Password reset indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_email ON password_reset_codes(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_code ON password_reset_codes(code);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_expires_at ON password_reset_codes(expires_at);

-- ============================================================================
-- 7. VERIFICATION QUERY
-- ============================================================================

-- Verify tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 
    'newsletter_subscriptions', 
    'waitlist_submissions', 
    'contact_submissions', 
    'apis', 
    'api_analytics', 
    'password_reset_codes'
  )
ORDER BY tablename;
