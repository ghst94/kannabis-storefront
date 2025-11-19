import Image from "next/image"
import { ArrowRightIcon } from "@/icons"
import Link from "next/link"

type HeroProps = {
  image: string
  heading: string
  paragraph: string
  buttons: { label: string; path: string }[]
}

export const Hero = ({ image, heading, paragraph, buttons }: HeroProps) => {
  return (
    <section className="w-full relative min-h-[70vh] lg:min-h-[85vh] flex items-center text-primary overflow-hidden bg-black">
      {/* Clean gradient background - Cookies.co style */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-950 to-black" />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Optional: Background product image */}
      {image && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full container py-12 lg:py-16">
        <div className="max-w-[700px]">
          <h1 className="font-barlow text-5xl lg:text-7xl font-bold uppercase mb-6 text-white leading-tight">
            {heading}
          </h1>
          <p className="font-barlow text-lg lg:text-xl mb-10 text-gray-300 max-w-[600px] leading-relaxed">
            {paragraph}
          </p>

          {buttons.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {buttons.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className="group inline-flex items-center gap-3 bg-white text-black hover:bg-emerald-500 hover:text-white transition-all duration-300 px-8 py-4 font-barlow font-bold uppercase tracking-wide text-sm rounded-sm"
                  aria-label={label}
                  title={label}
                >
                  <span>{label}</span>
                  <ArrowRightIcon
                    color="currentColor"
                    aria-hidden
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
