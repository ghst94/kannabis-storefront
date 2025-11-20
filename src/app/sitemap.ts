import { MetadataRoute } from "next"
import { listProducts } from "@/lib/data/products"
import { listCategories } from "@/lib/data/categories"
import { listCollections } from "@/lib/data/collections"
import { listRegions } from "@/lib/data/regions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shop.kannabis.io"
  const currentDate = new Date()

  // Fetch all regions to get locales
  const regions = await listRegions()
  const locales =
    Array.from(
      new Set(
        (regions || []).flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
      )
    ) || ["us"]

  const sitemap: MetadataRoute.Sitemap = []

  // Add homepage for each locale
  for (const locale of locales) {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    })
  }

  // Fetch categories
  try {
    const { categories } = await listCategories({ query: { limit: 1000 } })

    for (const locale of locales) {
      // Add main categories page
      sitemap.push({
        url: `${baseUrl}/${locale}/categories`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      })

      // Add individual category pages
      for (const category of categories) {
        if (category.handle) {
          sitemap.push({
            url: `${baseUrl}/${locale}/categories/${category.handle}`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error)
  }

  // Fetch collections
  try {
    const { collections } = await listCollections({ limit: "1000" })

    for (const locale of locales) {
      for (const collection of collections) {
        if (collection.handle) {
          sitemap.push({
            url: `${baseUrl}/${locale}/collections/${collection.handle}`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.7,
          })
        }
      }
    }
  } catch (error) {
    console.error("Error fetching collections for sitemap:", error)
  }

  // Fetch products for each locale
  try {
    for (const locale of locales) {
      let page = 1
      let hasMore = true

      while (hasMore) {
        const { response, nextPage } = await listProducts({
          pageParam: page,
          countryCode: locale,
          queryParams: {
            limit: 100,
            fields: "id,handle,updated_at",
          },
        })

        for (const product of response.products) {
          if (product.handle) {
            sitemap.push({
              url: `${baseUrl}/${locale}/products/${product.handle}`,
              lastModified: product.updated_at
                ? new Date(product.updated_at)
                : currentDate,
              changeFrequency: "weekly",
              priority: 0.6,
            })
          }
        }

        hasMore = nextPage !== null
        page = nextPage || page + 1

        // Safety limit to prevent infinite loops
        if (page > 100) break
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
  }

  return sitemap
}
