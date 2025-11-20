#!/bin/bash

# Setup Supabase database via psql
# This creates the profiles table and RLS policies

set -e

echo "🗄️  Setting up Supabase database..."

# Connection string for Supabase (uses pooled connection)
DB_URL="postgresql://postgres.hcrvoghemvhnzbfhppvg:$(grep SUPABASE_SERVICE_ROLE_KEY .env | cut -d'=' -f2)@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Execute SQL
psql "$DB_URL" << 'EOF'
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

\q
EOF

echo "✅ Supabase database setup complete!"
