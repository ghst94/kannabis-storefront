import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

export function CategoryCard({
  category,
}: {
  category: { name: string; handle: string }
}) {
  // Category images with premium cannabis product photography style
  const categoryImages: Record<string, { bg: string; overlay: string }> = {
    flower: {
      bg: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      overlay: "https://images.pexels.com/photos/4198626/pexels-photo-4198626.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    edibles: {
      bg: "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
      overlay: "https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    concentrates: {
      bg: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
      overlay: "https://images.pexels.com/photos/6992828/pexels-photo-6992828.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    vapes: {
      bg: "linear-gradient(135deg, #0891b2 0%, #6366f1 100%)",
      overlay: "https://images.pexels.com/photos/8505147/pexels-photo-8505147.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    accessories: {
      bg: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
      overlay: "https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    prerolls: {
      bg: "linear-gradient(135deg, #65a30d 0%, #16a34a 100%)",
      overlay: "https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    tinctures: {
      bg: "linear-gradient(135deg, #e11d48 0%, #ec4899 100%)",
      overlay: "https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
  }

  const categoryData = categoryImages[category.handle.toLowerCase()] || categoryImages.flower

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-[300px] h-[400px]"
    >
      {/* Image section with gradient background */}
      <div className="relative h-[280px] w-full overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{ background: categoryData.bg }}
        />

        {/* Product image overlay */}
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />

        {/* Optional: Add real product image here when available */}
        {/* <Image
          src={categoryData.overlay}
          alt={category.name}
          fill
          className="object-cover opacity-60 mix-blend-overlay"
        /> */}
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col justify-between p-6 bg-white">
        <div>
          <h3 className="font-barlow text-2xl font-bold text-gray-900 uppercase tracking-wide mb-2 group-hover:text-emerald-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600">Explore collection</p>
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center text-gray-900 group-hover:text-emerald-600 transition-colors">
          <span className="text-sm font-semibold mr-2">SHOP NOW</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
