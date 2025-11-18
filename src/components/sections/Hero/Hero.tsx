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
    <section className="w-full relative min-h-[70vh] lg:min-h-[85vh] flex items-end text-primary overflow-hidden">
      {/* Full-width background image */}
      <Image
        src={decodeURIComponent(image)}
        fill
        alt={`Hero banner - ${heading}`}
        className="object-cover"
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 w-full container pb-12 lg:pb-16">
        <div className="max-w-[800px]">
          <h1 className="display-md uppercase mb-6 text-white">
            {heading}
          </h1>
          <p className="text-xl mb-10 text-neutral-200 max-w-[600px]">{paragraph}</p>

          {buttons.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {buttons.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className="group inline-flex items-center gap-3 bg-white text-black hover:bg-neutral-200 transition-all duration-300 px-8 py-4 font-bold uppercase tracking-wide text-sm"
                  aria-label={label}
                  title={label}
                >
                  <span>{label}</span>
                  <ArrowRightIcon
                    color="#000000"
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
