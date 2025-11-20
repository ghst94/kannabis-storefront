import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID!
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!

// Protect this endpoint
const SEED_SECRET = process.env.REVALIDATE_SECRET || 'supersecret'

interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  images: Array<{ id: string; url: string }>
  variants: Array<{
    id: string
    title: string
    prices: Array<{ amount: number; currency_code: string }>
    inventory_quantity: number
  }>
  categories: Array<{ id: string; name: string; handle: string }>
  tags: Array<{ id: string; value: string }>
  metadata: Record<string, any>
}

async function fetchFromMedusa(endpoint: string) {
  const response = await fetch(`${MEDUSA_BACKEND_URL}${endpoint}`, {
    headers: {
      'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`)
  }

  return response.json()
}

function transformProductForAlgolia(product: MedusaProduct) {
  const lowestPrice = product.variants?.reduce((min, variant) => {
    const price = variant.prices?.[0]?.amount || Infinity
    return price < min ? price : min
  }, Infinity)

  return {
    objectID: product.id,
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    thumbnail: product.thumbnail,
    images: product.images?.map((img) => img.url) || [],
    price: lowestPrice !== Infinity ? lowestPrice / 100 : 0,
    currency: product.variants?.[0]?.prices?.[0]?.currency_code || 'usd',
    categories: product.categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
    })) || [],
    tags: product.tags?.map((tag) => tag.value) || [],
    metadata: product.metadata || {},
    inStock: product.variants?.some((v) => v.inventory_quantity > 0) || false,
    createdAt: Date.now(),
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const { secret } = await request.json()

    if (secret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🌱 Starting seed process...')

    // Fetch products from Medusa
    const { products } = await fetchFromMedusa('/store/products?limit=100')
    console.log(`✅ Fetched ${products.length} products`)

    // Fetch categories
    const { product_categories } = await fetchFromMedusa('/store/product-categories')
    console.log(`✅ Fetched ${product_categories.length} categories`)

    // Initialize Algolia
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

    // Transform and index products
    const algoliaObjects = products.map(transformProductForAlgolia)

    // Configure index settings
    await client.setSettings({
      indexName: 'products',
      indexSettings: {
        searchableAttributes: [
          'title',
          'description',
          'categories.name',
          'tags',
        ],
        attributesForFaceting: [
          'filterOnly(categories.id)',
          'filterOnly(categories.handle)',
          'tags',
          'inStock',
        ],
        customRanking: ['desc(createdAt)'],
      }
    })

    // Save to Algolia
    await client.saveObjects({
      indexName: 'products',
      objects: algoliaObjects
    })

    console.log('✅ Seed complete!')

    return NextResponse.json({
      success: true,
      message: 'Seed completed successfully',
      stats: {
        products: products.length,
        categories: product_categories.length,
        algoliaObjects: algoliaObjects.length,
      },
    })
  } catch (error: any) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json(
      {
        error: 'Seed failed',
        message: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Seed endpoint. Use POST with { "secret": "your-secret" }',
    instructions: 'curl -X POST https://shop.kannabis.io/api/seed -H "Content-Type: application/json" -d \'{"secret":"supersecret"}\'',
  })
}
