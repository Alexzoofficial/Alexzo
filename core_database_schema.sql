-- ====================================================================
-- CORE DATABASE SCHEMA FOR ALEXZO AI-POWERED PLATFORM
-- Google OAuth Only Authentication - No Demo Mode
-- Date: 2025-09-11
-- ====================================================================

-- ====================================================================
-- 1. USER PROFILES TABLE (Google OAuth Only)
-- ====================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  provider TEXT DEFAULT 'google' NOT NULL,
  provider_id TEXT,
  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can create profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_provider ON profiles(provider);
CREATE INDEX IF NOT EXISTS idx_profiles_last_sign_in ON profiles(last_sign_in);

-- ====================================================================
-- 2. USER CREATION TRIGGER (Google OAuth Optimized)
-- ====================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url, provider, provider_id, last_sign_in)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.app_metadata->>'provider', 'google'),
    NEW.raw_user_meta_data->>'sub',
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    last_sign_in = NOW(),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ====================================================================
-- 3. CONTACT SUBMISSIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for contact submissions
CREATE POLICY "Allow contact form submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

-- ====================================================================
-- 4. NEWSLETTER SUBSCRIPTIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscriptions(active);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscriptions(created_at);

-- ====================================================================
-- 5. WAITLIST SUBMISSIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  company TEXT,
  use_case TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'notified', 'converted')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow waitlist submissions" ON waitlist_submissions
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_submissions(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_product ON waitlist_submissions(product);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_submissions(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON waitlist_submissions(priority DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_submissions(created_at);

-- ====================================================================
-- 6. APIS TABLE (User API Management)
-- ====================================================================
CREATE TABLE IF NOT EXISTS apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET' CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  api_key TEXT NOT NULL UNIQUE,
  requests_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  rate_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for APIs
CREATE POLICY "Users can manage their own APIs" ON apis
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_apis_user_id ON apis(user_id);
CREATE INDEX IF NOT EXISTS idx_apis_api_key ON apis(api_key);
CREATE INDEX IF NOT EXISTS idx_apis_status ON apis(status);

-- ====================================================================
-- 7. API ANALYTICS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS api_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_id UUID REFERENCES apis(id) ON DELETE CASCADE,
  request_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  response_time_avg DECIMAL(8,2) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE api_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can view analytics for their APIs" ON api_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM apis 
      WHERE apis.id = api_analytics.api_id 
      AND apis.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_analytics_api_id ON api_analytics(api_id);
CREATE INDEX IF NOT EXISTS idx_api_analytics_date ON api_analytics(date);

-- ====================================================================
-- 8. GENERATED CONTENT TABLE (AI-generated content)
-- ====================================================================
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'text', 'video', 'audio')),
  prompt TEXT NOT NULL,
  content_url TEXT,
  content_data JSONB,
  model_used TEXT,
  generation_time DECIMAL(6,3),
  cost DECIMAL(10,4) DEFAULT 0,
  status TEXT DEFAULT 'generated' CHECK (status IN ('pending', 'generated', 'failed', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own generated content" ON generated_content
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_type ON generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_created ON generated_content(created_at);

-- ====================================================================
-- 9. UTILITY FUNCTIONS
-- ====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apis_updated_at ON apis;
CREATE TRIGGER update_apis_updated_at
  BEFORE UPDATE ON apis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 10. COMMENTS AND DOCUMENTATION
-- ====================================================================
COMMENT ON TABLE profiles IS 'User profiles with Google OAuth authentication only';
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website';
COMMENT ON TABLE newsletter_subscriptions IS 'Newsletter email subscriptions';
COMMENT ON TABLE waitlist_submissions IS 'Product waitlist signups';
COMMENT ON TABLE apis IS 'User-managed APIs and endpoints';
COMMENT ON TABLE api_analytics IS 'API usage analytics and metrics';
COMMENT ON TABLE generated_content IS 'AI-generated content (images, text, etc.)';

-- ====================================================================
-- END OF CORE SCHEMA
-- ====================================================================