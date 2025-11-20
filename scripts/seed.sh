#!/bin/bash

# Seed script to sync data from Medusa to Algolia
# Usage: ./scripts/seed.sh

set -e

echo "🌱 Kannabis Storefront - Seed from Medusa"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check required environment variables
if [ -z "$NEXT_PUBLIC_MEDUSA_BACKEND_URL" ]; then
  echo "❌ Error: NEXT_PUBLIC_MEDUSA_BACKEND_URL not set"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_ALGOLIA_ID" ]; then
  echo "❌ Error: NEXT_PUBLIC_ALGOLIA_ID not set"
  exit 1
fi

if [ -z "$ALGOLIA_ADMIN_KEY" ]; then
  echo "⚠️  Warning: ALGOLIA_ADMIN_KEY not set"
  echo "   You need the Algolia admin key (not the search key) to index data"
  echo "   Get it from: https://www.algolia.com/account/api-keys"
  exit 1
fi

# Run the seed script
echo "Running seed script..."
npx tsx scripts/seed-from-medusa.ts
