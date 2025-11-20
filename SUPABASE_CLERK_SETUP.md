# Supabase + Clerk Integration Setup Guide

## Overview
This guide will help you complete the integration between Clerk (authentication) and Supabase (user database).

## What's Already Configured

✅ Supabase environment variables added to `.env`
✅ Supabase client utilities created (`src/lib/supabase/client.ts` and `server.ts`)
✅ Clerk JWT template created (name: "supabase")
✅ Webhook handler created to sync users (`src/app/api/webhooks/clerk/route.ts`)
✅ Clerk proxy configured at `/api/__clerk`

## Steps to Complete Setup

### 1. Run SQL Setup in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `hcrvoghemvhnzbfhppvg`
3. Navigate to: **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-setup.sql`
6. Click **Run** to execute the SQL

This will create:
- `profiles` table to store user data
- Row Level Security (RLS) policies
- Triggers for automatic user profile management

### 2. Configure Supabase to Accept Clerk JWT Tokens

#### Option A: Via Supabase Dashboard (Recommended)

1. In Supabase Dashboard, go to: **Authentication** → **Providers**
2. Scroll to **Third-party Auth** or **JWT** section
3. Click **Add Provider** or **Configure JWT**
4. Enter the following settings:
   - **Provider Name**: `Clerk`
   - **JWKS URI**: `https://shop.kannabis.io/api/__clerk/.well-known/jwks.json`
   - **Issuer**: `https://shop.kannabis.io/api/__clerk`
   - **Audience**: `authenticated`
5. Save the configuration

#### Option B: Via Supabase Management API

```bash
curl -X POST 'https://hcrvoghemvhnzbfhppvg.supabase.co/auth/v1/admin/sso/providers' \
  -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "jwt",
    "jwks_uri": "https://shop.kannabis.io/api/__clerk/.well-known/jwks.json",
    "issuer": "https://shop.kannabis.io/api/__clerk"
  }'
```

### 3. Configure Clerk Webhook

1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Navigate to: **Webhooks** (left sidebar)
4. Click **Add Endpoint**
5. Enter webhook details:
   - **Endpoint URL**: `https://shop.kannabis.io/api/webhooks/clerk`
   - **Subscribe to events**:
     - ✅ `user.created`
     - ✅ `user.updated`
     - ✅ `user.deleted`
6. Copy the **Signing Secret** shown after creation
7. Verify it matches `CLERK_WEBHOOK_SECRET` in your `.env` file

### 4. Deploy to Production

Deploy the latest changes to Vercel:

```bash
vercel --prod --yes
```

### 5. Test the Integration

#### Test User Sign-Up Flow:

1. Visit: https://shop.kannabis.io
2. Click **Sign Up** and create a test account
3. After sign-up, verify the user was created in:
   - **Clerk Dashboard** → Users
   - **Medusa Admin** → Customers
   - **Supabase Dashboard** → Table Editor → profiles

#### Test Supabase Client Usage:

```typescript
import { getSupabaseClient } from '@/lib/supabase/server'

// In a Server Component or API route
const supabase = await getSupabaseClient()
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .single()

// This will automatically use the Clerk JWT token
// and respect RLS policies
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  User signs up/in via Clerk                            │
│  ↓                                                      │
│  Clerk Proxy (/api/__clerk)                            │
│  ↓                                                      │
│  Clerk Frontend API                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌───────────────┐    ┌──────────────────┐
│               │    │                  │
│  Webhook      │    │  JWT Template    │
│  Triggers     │    │  "supabase"      │
│               │    │                  │
└───────┬───────┘    └────────┬─────────┘
        ↓                     ↓
┌───────────────┐    ┌──────────────────┐
│               │    │                  │
│  Supabase     │    │  API Requests    │
│  profiles     │    │  with JWT        │
│  table        │    │                  │
└───────────────┘    └──────────────────┘

Medusa Backend (separate database)
└── Stores products, orders, inventory
```

## Data Flow

1. **User Signs Up**: Clerk creates user account
2. **Webhook Fires**: `/api/webhooks/clerk` receives event
3. **Dual Sync**:
   - Creates customer in Medusa (for orders/cart)
   - Creates profile in Supabase (for app data)
4. **JWT Token**: Clerk generates JWT with "supabase" template
5. **Authenticated Requests**: Frontend uses JWT to access Supabase with RLS

## Troubleshooting

### Webhook Not Firing
- Check Clerk Dashboard → Webhooks → Your endpoint → Recent Events
- Verify `CLERK_WEBHOOK_SECRET` in Vercel environment variables
- Check Vercel logs: `vercel logs --prod`

### JWT Token Invalid
- Verify JWKS URL is accessible: `curl https://shop.kannabis.io/api/__clerk/.well-known/jwks.json`
- Check Supabase JWT configuration matches Clerk issuer
- Ensure JWT template "supabase" exists in Clerk

### RLS Policy Blocking Access
- Verify user is authenticated: `auth.uid()` should not be null
- Check the JWT token includes required claims
- Test with service role key first to isolate RLS issues

### Database Connection Issues
- Verify Supabase URL and keys in `.env` are correct
- Test connection: `curl https://hcrvoghemvhnzbfhppvg.supabase.co/rest/v1/`
- Check Supabase project is not paused

## Security Notes

- **Service Role Key**: Only use `SUPABASE_SERVICE_ROLE_KEY` in server-side code (API routes)
- **Anon Key**: Safe to use in client-side code (protected by RLS)
- **JWT Secret**: Keep `SUPABASE_JWT_SECRET` secure (only needed for custom auth setup)
- **Webhook Secret**: Required to verify Clerk webhook signatures

## Next Steps

After setup is complete:

1. Create additional tables in Supabase for your app data
2. Configure RLS policies for each table
3. Use `getSupabaseClient()` in API routes for authenticated queries
4. Use `supabase` client in client components for real-time features
