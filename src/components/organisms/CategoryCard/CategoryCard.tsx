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
      className="group relative flex flex-col bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:border-cookies-yellow hover:shadow-xl w-[280px] h-[380px]"
    >
      {/* Image section - Cookies.co style */}
      <div className="relative h-[280px] w-full overflow-hidden bg-white">
        {/* Gradient background */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: categoryData.bg }}
        />

        {/* Minimal overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category name overlay - Cookies.co style */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h3 className="font-barlow text-4xl font-black text-white uppercase tracking-tight drop-shadow-2xl">
              {category.name}
            </h3>
          </div>
        </div>

        {/* Optional: Add real product image here when available */}
        {/* <Image
          src={categoryData.overlay}
          alt={category.name}
          fill
          className="object-cover opacity-60 mix-blend-overlay"
        /> */}
      </div>

      {/* Content section - Cookies.co style */}
      <div className="flex-1 flex flex-col justify-center p-5 bg-white border-t border-gray-200">
        {/* Shop Now CTA */}
        <div className="flex items-center justify-center gap-2 text-black group-hover:text-cookies-blue transition-colors">
          <span className="font-barlow text-sm font-black uppercase tracking-widest">SHOP NOW</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
