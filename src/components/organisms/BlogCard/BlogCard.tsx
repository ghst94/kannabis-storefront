import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { BlogPost } from "@/types/blog"
import { ArrowRightIcon } from "@/icons"
import tailwindConfig from "../../../../tailwind.config"
import { cn } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  // RTFKT-inspired gradient colors for each blog post
  const gradients = [
    "from-green-500 via-emerald-600 to-teal-700", // Terpenes - green theme
    "from-indigo-500 via-purple-600 to-violet-700", // Relaxation - purple theme
    "from-amber-500 via-orange-600 to-red-600", // Edibles - warm theme
  ]

  return (
    <LocalizedClientLink
      href={post.href}
      className={cn(
        "group block border border-secondary p-1 rounded-sm relative",
        index > 0 && "hidden lg:block"
      )}
    >
      <div className="relative overflow-hidden rounded-xs h-full min-h-[472px]">
        {/* RTFKT-style gradient background */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradients[index % gradients.length])} />

        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Glowing effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-white/5 blur-2xl" />
      </div>
      <div className="p-4 bg-tertiary text-tertiary absolute bottom-0 left-1 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-xs w-[calc(100%-8px)]">
        <h3 className="heading-sm">{post.title}</h3>
        <p className="text-md line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-4 uppercase label-md mt-[26px]">
          Read more{" "}
          <ArrowRightIcon
            size={20}
            color={tailwindConfig.theme.extend.colors.tertiary}
          />
        </div>
      </div>
    </LocalizedClientLink>
  )
}
