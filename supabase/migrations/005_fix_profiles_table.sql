-- Fix profiles table by adding missing email column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing profiles to have email from auth.users
UPDATE profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id AND profiles.email IS NULL;

-- Make email NOT NULL after update
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update trigger function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;