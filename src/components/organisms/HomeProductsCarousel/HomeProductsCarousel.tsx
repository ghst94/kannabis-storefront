import { Carousel } from "@/components/cells"
import { ProductCard } from "../ProductCard/ProductCard"
import { listProducts } from "@/lib/data/products"
import { Product } from "@/types/product"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@/lib/helpers/get-product-price"

export const HomeProductsCarousel = async ({
  locale,
  sellerProducts,
  home,
}: {
  locale: string
  sellerProducts: Product[]
  home: boolean
}) => {
  const {
    response: { products },
  } = await listProducts({
    countryCode: locale,
    queryParams: {
      limit: home ? 8 : undefined,
      order: "created_at",
      handle: home
        ? undefined
        : sellerProducts.map((product) => product.handle),
    },
    forceCache: false,
  }).catch((error) => {
    console.error("Failed to fetch products:", error)
    return { response: { products: [], count: 0 }, nextPage: null }
  })

  const displayProducts = home ? products : (sellerProducts.length ? sellerProducts : products)

  if (!displayProducts.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-zinc-400 text-lg">No products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full">
      <Carousel
        align="start"
        items={displayProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
              api_product={
                home
                  ? (product as HttpTypes.StoreProduct)
                  : products.find((p) => {
                      const { cheapestPrice } = getProductPrice({
                        product: p,
                      })
                      return (
                        cheapestPrice &&
                        p.id === product.id &&
                        Boolean(cheapestPrice)
                      )
                    })
              }
            />
          )
        )}
      />
    </div>
  )
}
