-- ============================================
-- SUPABASE + CLERK AUTHENTICATION SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This configures Supabase to accept Clerk JWT tokens

-- 1. Create a profiles table to store user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, clerk_user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'clerk_user_id',
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Create function to update profile timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for profile updates
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- CONFIGURATION NOTES:
-- ============================================
-- After running this SQL, you need to configure Supabase Authentication:
--
-- 1. Go to: Supabase Dashboard → Authentication → Providers
-- 2. Scroll down to "Custom" or "JWT" section
-- 3. Add Clerk as a third-party provider with:
--    - JWKS URL: https://shop.kannabis.io/api/__clerk/.well-known/jwks.json
--    - Issuer: https://shop.kannabis.io/api/__clerk
--
-- Or via Supabase Management API:
-- Run this command (replace YOUR_SUPABASE_SERVICE_ROLE_KEY):
--
-- curl -X POST 'https://hcrvoghemvhnzbfhppvg.supabase.co/auth/v1/admin/sso/providers' \
--   -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \
--   -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
--   -H "Content-Type: application/json" \
--   -d '{
--     "type": "jwt",
--     "jwks_uri": "https://shop.kannabis.io/api/__clerk/.well-known/jwks.json",
--     "issuer": "https://shop.kannabis.io/api/__clerk"
--   }'
