"use client"

import useEmblaCarousel from "embla-carousel-react"

import { Indicator } from "@/components/atoms"
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons"
import { useCallback, useEffect, useState } from "react"
import { EmblaCarouselType } from "embla-carousel"
import tailwindConfig from "../../../../tailwind.config"

export const CustomCarousel = ({
  variant = "light",
  items,
  align = "start",
}: {
  variant?: "light" | "dark"
  items: React.ReactNode[]
  align?: "center" | "start" | "end"
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const maxStep = items.length

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  const changeSlideHandler = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const arrowColor = {
    light: tailwindConfig.theme.extend.colors.primary,
    dark: tailwindConfig.theme.extend.colors.tertiary,
  }

  return (
    <div className="embla relative w-full flex justify-center">
      <div
        className="embla__viewport overflow-hidden rounded-xs w-full"
        ref={emblaRef}
      >
        <div className="embla__container flex gap-3 sm:gap-4 lg:gap-6 items-center py-8 px-2 sm:px-4">
          {items.map((slide) => slide)}
        </div>

        {/* Mobile Navigation - Touch-friendly controls */}
        <div className="flex justify-between items-center mt-6 gap-4 sm:hidden px-2">
          <div className="flex-1">
            <Indicator
              variant={variant}
              maxStep={maxStep}
              step={selectedIndex + 1}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => changeSlideHandler(selectedIndex - 1)}
              className="p-3 bg-zinc-800 border border-zinc-700 hover:border-lime-500 rounded-sm transition-all active:scale-95"
              aria-label="Previous slide"
            >
              <ArrowLeftIcon color="#84cc16" />
            </button>
            <button
              onClick={() => changeSlideHandler(selectedIndex + 1)}
              className="p-3 bg-zinc-800 border border-zinc-700 hover:border-lime-500 rounded-sm transition-all active:scale-95"
              aria-label="Next slide"
            >
              <ArrowRightIcon color="#84cc16" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation - Side arrows */}
        <div className="hidden sm:flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => changeSlideHandler(selectedIndex - 1)}
            className="p-3 bg-zinc-800 border border-zinc-700 hover:border-lime-500 rounded-sm transition-all hover:scale-105"
            aria-label="Previous slide"
          >
            <ArrowLeftIcon color="#84cc16" />
          </button>
          <div className="min-w-[120px]">
            <Indicator
              variant={variant}
              maxStep={maxStep}
              step={selectedIndex + 1}
            />
          </div>
          <button
            onClick={() => changeSlideHandler(selectedIndex + 1)}
            className="p-3 bg-zinc-800 border border-zinc-700 hover:border-lime-500 rounded-sm transition-all hover:scale-105"
            aria-label="Next slide"
          >
            <ArrowRightIcon color="#84cc16" />
          </button>
        </div>
      </div>
    </div>
  )
}
