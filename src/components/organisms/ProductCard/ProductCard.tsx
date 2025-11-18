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

  return (
    <div
      className={clsx(
        "relative group flex flex-col w-full lg:w-[calc(25%-1rem)] min-w-[250px] overflow-hidden transition-all duration-500 hover:scale-[1.02]"
      )}
    >
      {/* Image Container */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`View ${productName}`}
        title={`View ${productName}`}
        className="relative w-full aspect-square overflow-hidden bg-neutral-900"
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
            <Image
              priority
              fetchPriority="high"
              src="/images/placeholder.svg"
              alt={`${productName} image placeholder`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* "Shop Now" button - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button className="w-full bg-white text-black hover:bg-neutral-200 uppercase font-bold py-4 tracking-wide">
              Shop Now
            </Button>
          </div>
        </div>
      </LocalizedClientLink>

      {/* Product Info */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`Go to ${productName} page`}
        title={`Go to ${productName} page`}
        className="pt-4 pb-2"
      >
        <div className="space-y-2">
          <h3 className="heading-sm uppercase truncate group-hover:text-neutral-300 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-3">
            <p className="font-bold text-lg">{cheapestPrice?.calculated_price}</p>
            {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
              <p className="text-sm text-neutral-500 line-through">
                {cheapestPrice?.original_price}
              </p>
            )}
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
