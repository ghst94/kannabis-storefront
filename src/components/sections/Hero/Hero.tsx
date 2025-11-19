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
    <section className="w-full relative min-h-[60vh] lg:min-h-[75vh] flex items-center text-primary overflow-hidden bg-zinc-900">
      {/* Background image */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* If no image, use dark background with lime accent */}
      {!image && (
        <>
          <div className="absolute inset-0 bg-zinc-900" />
          {/* Lime green accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-lime-500" />
        </>
      )}

      {/* Content - Cookies.co style */}
      <div className="relative z-10 w-full container py-16 lg:py-20">
        <div className="max-w-[800px]">
          {/* Main heading - Cookies.co style */}
          <h1 className="font-barlow text-5xl lg:text-7xl xl:text-8xl font-black uppercase mb-6 text-white leading-[0.9] tracking-tighter">
            {heading}
          </h1>

          {/* Subheading - Lime green */}
          <p className="font-barlow text-xl lg:text-2xl mb-10 text-lime-500 font-bold uppercase tracking-wide max-w-[600px]">
            {paragraph}
          </p>

          {/* CTA Buttons - Lime green style */}
          {buttons.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {buttons.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className="group inline-flex items-center justify-center gap-3 bg-lime-500 text-black hover:bg-lime-400 hover:text-black transition-all duration-300 px-10 py-5 font-barlow font-black uppercase tracking-widest text-sm border-2 border-lime-500 hover:scale-105"
                  aria-label={label}
                  title={label}
                >
                  <span>{label}</span>
                  <ArrowRightIcon
                    color="currentColor"
                    aria-hidden
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lime green accent strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-lime-500" />
    </section>
  )
}
