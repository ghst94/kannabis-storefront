import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { HeartIcon, MessageIcon } from "@/icons"
import { listCategories } from "@/lib/data/categories"
import { PARENT_CATEGORIES } from "@/const"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { Wishlist } from "@/types/wishlist"
import { Badge } from "@/components/atoms"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { SearchButton } from "@/components/molecules/SearchButton/SearchButton"

export const Header = async () => {
  const user = await retrieveCustomer()
  let wishlist: Wishlist[] = []
  if (user) {
    const response = await getUserWishlists()
    wishlist = response.wishlists
  }

  const regions = await listRegions()

  const wishlistCount = wishlist?.[0]?.products.length || 0

  const { categories, parentCategories } = (await listCategories({
    headingCategories: PARENT_CATEGORIES,
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-neutral-800 transition-all duration-300">
      <div className="flex py-4 lg:px-8 px-4">
        {/* Left Section */}
        <div className="flex items-center lg:w-1/3 gap-4">
          <MobileNavbar
            parentCategories={parentCategories}
            childrenCategories={categories}
          />
        </div>

        {/* Center - Logo */}
        <div className="flex lg:justify-center lg:w-1/3 items-center pl-4 lg:pl-0">
          <LocalizedClientLink
            href="/"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/Logo.svg"
              width={126}
              height={40}
              alt="Logo"
              priority
              className="brightness-0 invert"
            />
          </LocalizedClientLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-3 lg:gap-6 w-full lg:w-1/3">
          <SearchButton />
          <CountrySelector regions={regions} />
          {user && <MessageButton />}
          <UserDropdown user={user} />
          {user && (
            <LocalizedClientLink
              href="/user/wishlist"
              className="relative hover:text-neutral-300 transition-colors"
            >
              <HeartIcon size={20} />
              {Boolean(wishlistCount) && (
                <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-white text-black">
                  {wishlistCount}
                </Badge>
              )}
            </LocalizedClientLink>
          )}
          <CartDropdown />
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar categories={categories} />
    </header>
  )
}
