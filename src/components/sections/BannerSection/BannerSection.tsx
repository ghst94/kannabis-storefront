import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"
import { AnimatedSection } from "@/components/atoms/AnimatedSection/AnimatedSection"

export const BannerSection = () => {
  return (
    <section className="bg-tertiary text-tertiary rounded-2xl overflow-hidden">
      <AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center hover-lift transition-all duration-500">
        <div className="py-6 px-6 flex flex-col h-full justify-between border border-secondary rounded-sm">
          <div className="mb-8 lg:mb-48">
            <span className="text-sm inline-block px-4 py-1 border border-secondary rounded-sm">
              #COLLECTION
            </span>
            <h2 className="display-sm">
              PREMIUM STRAINS: WHERE QUALITY MEETS EXPERIENCE
            </h2>
            <p className="text-lg text-tertiary max-w-lg">
              Discover handpicked cannabis strains cultivated for exceptional potency,
              flavor, and therapeutic benefits. Elevate your experience.
            </p>
          </div>
          <LocalizedClientLink href="/collections/premium-strains">
            <Button size="large" className="w-fit bg-secondary/10">
              EXPLORE
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full flex justify-end rounded-sm overflow-hidden">
          {/* Clean gradient background - Cookies.co style */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_50%,transparent_52%)] bg-[length:20px_20px]" />
          </div>

          {/* Optional: Add product image here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/10 text-9xl">🌿</div>
          </div>
        </div>
      </div>
      </AnimatedSection>
    </section>
  )
}
