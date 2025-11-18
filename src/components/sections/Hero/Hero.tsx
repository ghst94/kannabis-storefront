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
      {/* Gradient background with cannabis-inspired colors - with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-purple-900 to-black transform scale-110 transition-transform duration-[2000ms] ease-out"
           style={{ transform: 'translateY(calc(var(--scroll) * 0.5px))' }} />

      {/* Animated gradient overlay with enhanced animation */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 via-purple-600/20 to-pink-600/20"
           style={{
             animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite, float 6s ease-in-out infinite',
           }} />

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content overlay with fade-in animation */}
      <div className="relative z-10 w-full container pb-12 lg:pb-16 animate-fadeInUp">
        <div className="max-w-[800px]">
          <h1 className="display-md uppercase mb-6 text-white animate-slideInLeft">
            {heading}
          </h1>
          <p className="text-xl mb-10 text-neutral-200 max-w-[600px] animate-slideInLeft" style={{ animationDelay: '0.2s' }}>{paragraph}</p>

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
