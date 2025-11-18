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
    <section className="bg-primary container">
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
          {/* RTFKT-inspired holographic gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700" />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-transparent to-yellow-500/40" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Glowing orb effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
      </AnimatedSection>
    </section>
  )
}
