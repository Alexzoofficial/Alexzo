-- OAuth Updates - Remove email verification dependencies and optimize for Google OAuth
-- Date: 2025-09-11

-- Update profiles table to better support OAuth providers
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update the handle_new_user function for better OAuth support
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url, provider, provider_id, last_sign_in)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.app_metadata->>'provider', 'email'),
    NEW.raw_user_meta_data->>'sub',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update last sign in
CREATE OR REPLACE FUNCTION update_user_last_sign_in()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_sign_in = NOW(), 
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating last sign in
DROP TRIGGER IF EXISTS on_auth_user_signed_in ON auth.users;
CREATE TRIGGER on_auth_user_signed_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW 
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_user_last_sign_in();

-- Optional: Drop password_reset_codes table since we're using OAuth
-- Uncomment the next line if you want to completely remove password reset functionality
-- DROP TABLE IF EXISTS password_reset_codes CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_provider ON profiles(provider);
CREATE INDEX IF NOT EXISTS idx_profiles_last_sign_in ON profiles(last_sign_in);

-- Update RLS policies to support OAuth users better
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy for OAuth sign-ups (allows system to create profiles)
CREATE POLICY "System can insert profiles for OAuth" ON profiles
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE profiles IS 'User profiles supporting both email/password and OAuth authentication';
COMMENT ON COLUMN profiles.provider IS 'Authentication provider (email, google, etc.)';
COMMENT ON COLUMN profiles.provider_id IS 'Provider-specific user ID';
COMMENT ON COLUMN profiles.last_sign_in IS 'Last successful sign in timestamp';