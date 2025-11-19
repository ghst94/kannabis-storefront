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
    <section className="w-full relative min-h-[60vh] lg:min-h-[75vh] flex items-center text-primary overflow-hidden bg-white">
      {/* Background image - Cookies.co style */}
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
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* If no image, use clean white background with accent */}
      {!image && (
        <>
          <div className="absolute inset-0 bg-white" />
          {/* Yellow accent bar - Cookies.co style */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-cookies-yellow" />
        </>
      )}

      {/* Content - Cookies.co style */}
      <div className="relative z-10 w-full container py-16 lg:py-20">
        <div className="max-w-[800px]">
          {/* Main heading - Cookies.co style */}
          <h1 className="font-barlow text-5xl lg:text-7xl xl:text-8xl font-black uppercase mb-6 text-white leading-[0.9] tracking-tighter">
            {heading}
          </h1>

          {/* Subheading - Cookies.co cyan blue */}
          <p className="font-barlow text-xl lg:text-2xl mb-10 text-cookies-blue font-bold uppercase tracking-wide max-w-[600px]">
            {paragraph}
          </p>

          {/* CTA Buttons - Cookies.co style */}
          {buttons.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {buttons.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className="group inline-flex items-center justify-center gap-3 bg-cookies-orange text-cookies-light-yellow hover:bg-black hover:text-cookies-yellow transition-all duration-300 px-10 py-5 font-barlow font-black uppercase tracking-widest text-sm border-2 border-black hover:scale-105"
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

      {/* Yellow accent strip at bottom - Cookies.co style */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-cookies-yellow" />
    </section>
  )
}
