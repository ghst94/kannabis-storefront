import { algoliasearch } from 'algoliasearch'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID!
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY! // Need admin key for indexing

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

interface MedusaCategory {
  id: string
  name: string
  handle: string
  description: string
  parent_category_id: string | null
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

async function fetchAllProducts(): Promise<MedusaProduct[]> {
  console.log('📦 Fetching products from Medusa...')
  const data = await fetchFromMedusa('/store/products?limit=100')
  console.log(`✅ Found ${data.products.length} products`)
  return data.products
}

async function fetchAllCategories(): Promise<MedusaCategory[]> {
  console.log('📁 Fetching categories from Medusa...')
  const data = await fetchFromMedusa('/store/product-categories')
  console.log(`✅ Found ${data.product_categories.length} categories`)
  return data.product_categories
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

async function seedAlgolia(products: MedusaProduct[]) {
  console.log('\n🔍 Seeding Algolia...')

  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

  // Transform products for Algolia
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
      ranking: ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
    }
  })

  console.log(`📤 Uploading ${algoliaObjects.length} products to Algolia...`)

  // Save objects to Algolia
  const result = await client.saveObjects({
    indexName: 'products',
    objects: algoliaObjects
  })

  console.log('✅ Algolia seeding complete!')
  console.log(`   - Objects indexed: ${algoliaObjects.length}`)

  return result
}

async function seedSupabase(products: MedusaProduct[], categories: MedusaCategory[]) {
  console.log('\n💾 Seeding Supabase...')

  // This is optional - only if you want to cache product data in Supabase
  // For now, we'll skip this since products are in Medusa
  console.log('⏭️  Skipping Supabase seed (products stored in Medusa)')

  return null
}

async function main() {
  try {
    console.log('🌱 Starting seed process...\n')
    console.log(`Backend: ${MEDUSA_BACKEND_URL}`)
    console.log(`Algolia App ID: ${ALGOLIA_APP_ID}\n`)

    // Fetch data from Medusa
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ])

    // Seed Algolia for search
    await seedAlgolia(products)

    // Optionally seed Supabase
    await seedSupabase(products, categories)

    console.log('\n✅ Seed process complete!')
    console.log('\n📊 Summary:')
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Algolia: ✅ Indexed`)
    console.log(`   - Supabase: ⏭️  Skipped (using Medusa)`)

  } catch (error) {
    console.error('❌ Seed process failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { main as seedFromMedusa }
