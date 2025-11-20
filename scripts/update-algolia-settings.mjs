#!/usr/bin/env node
import { algoliasearch } from 'algoliasearch'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID || process.env.ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME || 'products'

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('❌ Error: Missing Algolia credentials')
  console.error('Required environment variables:')
  console.error('  - NEXT_PUBLIC_ALGOLIA_ID or ALGOLIA_APP_ID')
  console.error('  - ALGOLIA_ADMIN_KEY')
  process.exit(1)
}

async function updateAlgoliaSettings() {
  console.log('🔧 Updating Algolia index settings...\n')

  // Read configuration
  const configPath = join(__dirname, '..', 'algolia-index-config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf-8'))

  // Initialize Algolia client
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

  try {
    // Update settings
    console.log(`📝 Updating settings for index: ${INDEX_NAME}`)
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: config.settings
    })

    console.log('✅ Algolia settings updated successfully!')
    console.log('\nUpdated settings:')
    console.log(`  - Index: ${INDEX_NAME}`)
    console.log(`  - Searchable attributes: ${config.settings.searchableAttributes.length}`)
    console.log(`  - Faceting attributes: ${config.settings.attributesForFaceting.length}`)
    console.log(`  - Attributes to retrieve: ${config.settings.attributesToRetrieve.length}`)

  } catch (error) {
    console.error('❌ Error updating Algolia settings:', error.message)
    process.exit(1)
  }
}

updateAlgoliaSettings()
