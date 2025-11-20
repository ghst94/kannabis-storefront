import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, filters, hitsPerPage, page } = body

    // Validate query
    if (typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query must be a string' },
        { status: 400 }
      )
    }

    // Search in Algolia
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME || 'products'

    const result = await client.searchSingleIndex({
      indexName,
      searchParams: {
        query,
        filters: filters || '',
        hitsPerPage: hitsPerPage || 20,
        page: page || 0,
      },
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', message: error.message },
      { status: 500 }
    )
  }
}
