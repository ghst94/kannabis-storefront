"use client"

import Image from "next/image"
import { Button } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { BaseHit, Hit } from "instantsearch.js"
import clsx from "clsx"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getProductPrice } from "@/lib/helpers/get-product-price"

export const ProductCard = ({
  product,
  api_product,
}: {
  product: Hit<HttpTypes.StoreProduct> | Partial<Hit<BaseHit>>
  api_product?: HttpTypes.StoreProduct | null
}) => {
  if (!api_product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: api_product! as HttpTypes.StoreProduct,
  })

  const productName = String(product.title || "Product")

  // Extract cannabis-specific metadata (you can customize these fields in Medusa admin)
  const metadata = api_product.metadata || {}
  const thc = metadata.thc_percentage ? String(metadata.thc_percentage) : null
  const cbd = metadata.cbd_percentage ? String(metadata.cbd_percentage) : null
  const strainType = metadata.strain_type ? String(metadata.strain_type) : null // "Indica", "Sativa", "Hybrid"
  const effects = metadata.effects ? String(metadata.effects) : null // e.g., "Relaxing, Happy, Euphoric"

  return (
    <div
      className={clsx(
        "relative group flex flex-col w-full lg:w-[calc(25%-1rem)] min-w-[250px] overflow-hidden bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
      )}
    >
      {/* Image Container */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`View ${productName}`}
        title={`View ${productName}`}
        className="relative w-full aspect-square overflow-hidden bg-gray-100"
      >
        <div className="w-full h-full relative">
          {product.thumbnail ? (
            <Image
              priority
              fetchPriority="high"
              src={decodeURIComponent(product.thumbnail)}
              alt={`${productName} image`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
              <span className="text-white/20 text-6xl">🌿</span>
            </div>
          )}

          {/* Strain type badge */}
          {strainType && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full">
              <span className="text-xs font-barlow font-bold text-white uppercase tracking-wide">
                {strainType}
              </span>
            </div>
          )}

          {/* THC/CBD badges */}
          {(thc || cbd) && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {thc && (
                <div className="px-2 py-1 bg-emerald-600/90 backdrop-blur-sm rounded">
                  <span className="text-xs font-barlow font-bold text-white">
                    THC {thc}%
                  </span>
                </div>
              )}
              {cbd && (
                <div className="px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded">
                  <span className="text-xs font-barlow font-bold text-white">
                    CBD {cbd}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>
      </LocalizedClientLink>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-3">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`Go to ${productName} page`}
          title={`Go to ${productName} page`}
        >
          <h3 className="font-barlow text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Effects */}
        {effects && (
          <p className="text-xs text-gray-600 line-clamp-1">
            {effects}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-barlow font-bold text-xl text-gray-900">
              {cheapestPrice?.calculated_price}
            </p>
            {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
              <p className="text-sm text-gray-400 line-through">
                {cheapestPrice?.original_price}
              </p>
            )}
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-barlow font-bold text-sm px-4 py-2 rounded-sm">
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
