import { listProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/organisms';

export async function BlogSection({ locale }: { locale: string }) {
  // Fetch the newest products based on created_at date
  const {
    response: { products },
  } = await listProducts({
    countryCode: locale,
    queryParams: {
      limit: 3,
      order: '-created_at', // Newest first
    },
    forceCache: false,
  }).catch((error) => {
    console.error("Failed to fetch latest products:", error)
    return { response: { products: [], count: 0 }, nextPage: null }
  })

  if (!products.length) {
    return null
  }

  return (
    <section className='bg-zinc-800 rounded-2xl p-6 lg:p-8'>
      <div className='flex items-center justify-between mb-8 lg:mb-12'>
        <h2 className='heading-lg text-white uppercase font-barlow font-black'>
          THE LATEST DROPS
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            api_product={product}
          />
        ))}
      </div>
    </section>
  );
}
