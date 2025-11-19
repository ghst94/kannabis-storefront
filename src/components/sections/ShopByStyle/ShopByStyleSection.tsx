"use client"

import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowRightIcon } from "@/icons"
import { Style } from "@/types/styles"
import { AnimatedSection } from "@/components/atoms/AnimatedSection/AnimatedSection"

export const styles: Style[] = [
  {
    id: 1,
    name: "INDICA",
    href: "/collections/indica",
  },
  {
    id: 2,
    name: "SATIVA",
    href: "/collections/sativa",
  },
  {
    id: 3,
    name: "HYBRID",
    href: "/collections/hybrid",
  },
  {
    id: 4,
    name: "CBD",
    href: "/collections/cbd",
  },
  {
    id: 5,
    name: "HIGH THC",
    href: "/collections/high-thc",
  },
]

export function ShopByStyleSection() {
  return (
    <section className="bg-primary">
      <AnimatedSection>
        <h2 className="heading-lg text-primary mb-12">SHOP BY STRAIN</h2>
      </AnimatedSection>
      <AnimatedSection delay={200}>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="py-[52px] px-[58px] h-full border rounded-sm">
          {styles.map((style) => (
            <LocalizedClientLink
              key={style.id}
              href={style.href}
              className="group flex items-center gap-4 text-primary hover:text-action transition-colors border-b border-transparent hover:border-primary w-fit pb-2 mb-8"
            >
              <span className="heading-lg">{style.name}</span>
              <ArrowRightIcon className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </LocalizedClientLink>
          ))}
        </div>
        <div className="relative hidden lg:block h-[600px] rounded-sm overflow-hidden">
          {/* Clean premium gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-black" />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Centered content placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/5 text-9xl font-bold">KANNABIS</div>
          </div>
        </div>
      </div>
      </AnimatedSection>
    </section>
  )
}
