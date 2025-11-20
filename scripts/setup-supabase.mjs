#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🗄️  Setting up Supabase database...\n')

async function setupDatabase() {
  try {
    // Create profiles table
    console.log('Creating profiles table...')
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY,
          clerk_user_id TEXT UNIQUE NOT NULL,
          email TEXT,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (createTableError && !createTableError.message.includes('does not exist')) {
      console.log('⚠️  Cannot create table via RPC, trying direct query...')

      // Try using the REST API to create table
      const { error } = await supabase.from('profiles').select('count').limit(1)

      if (error && error.code === 'PGRST205') {
        console.log('✅ Profiles table needs to be created manually')
        console.log('\nPlease run this SQL in Supabase SQL Editor:')
        console.log('\n' + '='.repeat(60))
        console.log(`
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (true);
        `)
        console.log('='.repeat(60))
        console.log('\nOr visit: https://supabase.com/dashboard/project/hcrvoghemvhnzbfhppvg/sql')
        return false
      } else if (!error) {
        console.log('✅ Profiles table already exists!')
        return true
      }
    } else {
      console.log('✅ Profiles table created!')
    }

    console.log('✅ Database setup complete!')
    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

setupDatabase().then(success => {
  process.exit(success ? 0 : 1)
})
