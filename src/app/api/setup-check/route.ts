import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [] as Array<{ name: string; status: string; message: string; action?: string }>,
  }

  // Check 1: Supabase connection
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { error } = await supabase.from('profiles').select('count').limit(1)

    if (error && error.code === 'PGRST205') {
      results.checks.push({
        name: 'Supabase Profiles Table',
        status: 'missing',
        message: 'Profiles table does not exist',
        action: 'Run SQL in Supabase SQL Editor: https://supabase.com/dashboard/project/hcrvoghemvhnzbfhppvg/sql/new'
      })
    } else if (error) {
      results.checks.push({
        name: 'Supabase Profiles Table',
        status: 'error',
        message: error.message,
      })
    } else {
      results.checks.push({
        name: 'Supabase Profiles Table',
        status: 'ok',
        message: 'Profiles table exists and is accessible',
      })
    }
  } catch (error: any) {
    results.checks.push({
      name: 'Supabase Connection',
      status: 'error',
      message: error.message,
    })
  }

  // Check 2: Clerk JWKS
  try {
    const jwksResponse = await fetch('https://shop.kannabis.io/api/__clerk/.well-known/jwks.json')
    const jwks = await jwksResponse.json()

    if (jwks.keys && jwks.keys.length > 0) {
      results.checks.push({
        name: 'Clerk JWKS Endpoint',
        status: 'ok',
        message: `JWKS endpoint accessible with ${jwks.keys.length} key(s)`,
      })
    } else {
      results.checks.push({
        name: 'Clerk JWKS Endpoint',
        status: 'error',
        message: 'JWKS endpoint returned no keys',
      })
    }
  } catch (error: any) {
    results.checks.push({
      name: 'Clerk JWKS Endpoint',
      status: 'error',
      message: error.message,
    })
  }

  // Check 3: Medusa Backend
  try {
    const medusaResponse = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=1`, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
    })

    if (medusaResponse.ok) {
      const data = await medusaResponse.json()
      results.checks.push({
        name: 'Medusa Backend',
        status: 'ok',
        message: `Backend accessible, ${data.products?.length || 0} product(s) found`,
      })
    } else {
      results.checks.push({
        name: 'Medusa Backend',
        status: 'error',
        message: `HTTP ${medusaResponse.status}: ${medusaResponse.statusText}`,
      })
    }
  } catch (error: any) {
    results.checks.push({
      name: 'Medusa Backend',
      status: 'error',
      message: error.message,
    })
  }

  // Check 4: Clerk JWT Template
  try {
    const templateResponse = await fetch('https://api.clerk.com/v1/jwt_templates', {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    if (templateResponse.ok) {
      const templates = await templateResponse.json()
      const supabaseTemplate = templates.find((t: any) => t.name === 'supabase')

      if (supabaseTemplate) {
        results.checks.push({
          name: 'Clerk JWT Template',
          status: 'ok',
          message: 'Supabase JWT template exists',
        })
      } else {
        results.checks.push({
          name: 'Clerk JWT Template',
          status: 'missing',
          message: 'Supabase JWT template not found',
        })
      }
    } else {
      results.checks.push({
        name: 'Clerk JWT Template',
        status: 'error',
        message: `HTTP ${templateResponse.status}`,
      })
    }
  } catch (error: any) {
    results.checks.push({
      name: 'Clerk JWT Template',
      status: 'error',
      message: error.message,
    })
  }

  // Generate setup instructions
  const instructions = {
    supabase: {
      sql: `-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/hcrvoghemvhnzbfhppvg/sql/new

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
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (true);`,
    },
    clerk: {
      webhook: {
        url: 'https://shop.kannabis.io/api/webhooks/clerk',
        events: ['user.created', 'user.updated', 'user.deleted'],
        dashboard: 'https://dashboard.clerk.com',
      },
    },
  }

  return NextResponse.json({
    ...results,
    instructions,
    summary: {
      total: results.checks.length,
      ok: results.checks.filter(c => c.status === 'ok').length,
      missing: results.checks.filter(c => c.status === 'missing').length,
      error: results.checks.filter(c => c.status === 'error').length,
    },
  })
}
