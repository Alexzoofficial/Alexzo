-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Add email column to profiles if not exists (for Firebase compatibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Create public data table (equivalent to Firebase public node)
CREATE TABLE IF NOT EXISTS public_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table (equivalent to Firebase contacts node)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table (equivalent to Firebase analytics node)
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  data JSONB,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Profiles policies (equivalent to Firebase profiles/$uid rules)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Public data policies (equivalent to Firebase public rules)
CREATE POLICY "Anyone can read public data" ON public_data
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can write public data" ON public_data
  FOR ALL USING (auth.role() = 'authenticated');

-- Contacts policies (equivalent to Firebase contacts/$uid rules)
CREATE POLICY "Users can read own contacts" ON contacts
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can write own contacts" ON contacts
  FOR ALL USING (auth.uid()::text = user_id);

-- Analytics policies (equivalent to Firebase analytics rules)
CREATE POLICY "Authenticated users can write analytics" ON analytics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can read analytics" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()::text
    )
  );

-- Admin policies (equivalent to Firebase admins rules - no read/write for regular users)
CREATE POLICY "No public access to admins" ON admins
  FOR ALL USING (false);

-- Contact submissions policies (equivalent to Firebase contacts/$uid rules)
DROP POLICY IF EXISTS "Admin can view contact submissions" ON contact_submissions;

CREATE POLICY "Users can view own contact submissions" ON contact_submissions
  FOR SELECT USING (
    auth.uid()::text = (metadata->>'user_id') OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add metadata column to contact_submissions for user tracking
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = user_uuid::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public_data;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics;
