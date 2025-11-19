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
        "relative group flex flex-col w-full lg:w-[calc(25%-1rem)] min-w-[250px] overflow-hidden bg-zinc-800 transition-all duration-300"
      )}
    >
      {/* Image Container */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`View ${productName}`}
        title={`View ${productName}`}
        className="relative w-full aspect-square overflow-hidden bg-zinc-900 border border-zinc-700 group-hover:border-lime-500 transition-all duration-300"
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
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-zinc-700">
              <span className="text-zinc-700 text-6xl">🌿</span>
            </div>
          )}

          {/* Strain type badge - top left */}
          {strainType && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white">
              <span className="text-[10px] font-barlow font-bold uppercase tracking-wider">
                {strainType}
              </span>
            </div>
          )}

          {/* THC/CBD badges - bottom right */}
          {(thc || cbd) && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {thc && (
                <div className="px-2 py-1 bg-lime-500 text-black border border-black">
                  <span className="text-[10px] font-barlow font-extrabold uppercase">
                    {thc}% THC
                  </span>
                </div>
              )}
              {cbd && (
                <div className="px-2 py-1 bg-purple-500 text-white border border-black">
                  <span className="text-[10px] font-barlow font-extrabold uppercase">
                    {cbd}% CBD
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </LocalizedClientLink>

      {/* Product Info - Dark theme */}
      <div className="p-4 flex flex-col gap-2 bg-zinc-800">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`Go to ${productName} page`}
          title={`Go to ${productName} page`}
        >
          <h3 className="font-barlow text-base font-bold text-white uppercase tracking-wide group-hover:text-lime-500 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Effects */}
        {effects && (
          <p className="text-xs text-zinc-400 uppercase tracking-wide font-semibold line-clamp-1">
            {effects}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <p className="font-barlow font-black text-2xl text-white">
              {cheapestPrice?.calculated_price}
            </p>
            {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
              <p className="text-sm text-zinc-500 line-through font-barlow">
                {cheapestPrice?.original_price}
              </p>
            )}
          </div>
          <Button className="bg-lime-500 hover:bg-lime-400 text-black font-barlow font-black text-xs uppercase tracking-wider px-4 py-2 transition-all hover:scale-105">
            ADD
          </Button>
        </div>
      </div>
    </div>
  )
}
