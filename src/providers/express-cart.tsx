"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { useRegion } from "./region"

type ExpressCartContextType = {
  cart?: HttpTypes.StoreCart
  addToCart: (
    variantId: string,
    quantity: number
  ) => Promise<HttpTypes.StoreCart>
  updateCart: (data: {
    updateData?: HttpTypes.StoreUpdateCart
    shippingMethodData?: HttpTypes.StoreAddCartShippingMethods
  }) => Promise<HttpTypes.StoreCart | undefined>
  refreshCart: () => Promise<HttpTypes.StoreCart | undefined>
  updateItemQuantity: (
    itemId: string,
    quantity: number
  ) => Promise<HttpTypes.StoreCart>
  unsetCart: () => void
}

const ExpressCartContext = createContext<ExpressCartContextType | null>(null)

export const ExpressCartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>()
  const { region } = useRegion()

  useEffect(() => {
    if (!region) {
      return
    }

    if (cart) {
      localStorage.setItem("express_cart_id", cart.id)
      return
    }

    const cartId = localStorage.getItem("express_cart_id")
    if (!cartId) {
      refreshCart()
    } else {
      sdk.store.cart
        .retrieve(cartId, {
          fields:
            "+items.variant.*,+items.variant.product.*,+items.variant.options.*,+items.variant.options.option.*",
        })
        .then(({ cart: dataCart }) => {
          setCart(dataCart)
        })
        .catch((error) => {
          console.error("Failed to retrieve cart:", error)
          refreshCart()
        })
    }
  }, [cart, region])

  useEffect(() => {
    if (!cart || !region || cart.region_id === region.id) {
      return
    }

    sdk.store.cart
      .update(cart.id, {
        region_id: region.id,
      })
      .then(({ cart: dataCart }) => {
        setCart(dataCart)
      })
      .catch((error) => {
        console.error("Failed to update cart region:", error)
      })
  }, [region])

  const refreshCart = async () => {
    if (!region) {
      return
    }

    try {
      const { cart: dataCart } = await sdk.store.cart.create({
        region_id: region.id,
      })

      localStorage.setItem("express_cart_id", dataCart.id)
      setCart(dataCart)
      return dataCart
    } catch (error) {
      console.error("Failed to create cart:", error)
      throw error
    }
  }

  const addToCart = async (variantId: string, quantity: number) => {
    const newCart = await refreshCart()
    if (!newCart) {
      throw new Error("Could not create cart")
    }

    try {
      const { cart: dataCart } = await sdk.store.cart.createLineItem(
        newCart.id,
        {
          variant_id: variantId,
          quantity,
        }
      )

      setCart(dataCart)
      return dataCart
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      throw error
    }
  }

  const updateCart = async ({ updateData, shippingMethodData }: {
    updateData?: HttpTypes.StoreUpdateCart
    shippingMethodData?: HttpTypes.StoreAddCartShippingMethods
  }) => {
    if (!updateData && !shippingMethodData) {
      return cart
    }

    try {
      let returnedCart = cart

      if (updateData) {
        const { cart: dataCart } = await sdk.store.cart.update(
          cart!.id,
          updateData
        )
        returnedCart = dataCart
      }

      if (shippingMethodData) {
        const { cart: dataCart } = await sdk.store.cart.addShippingMethod(
          cart!.id,
          shippingMethodData
        )
        returnedCart = dataCart
      }

      setCart(returnedCart)
      return returnedCart
    } catch (error) {
      console.error("Failed to update cart:", error)
      throw error
    }
  }

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      const { cart: dataCart } = await sdk.store.cart.updateLineItem(
        cart!.id,
        itemId,
        { quantity }
      )

      setCart(dataCart)
      return dataCart
    } catch (error) {
      console.error("Failed to update item quantity:", error)
      throw error
    }
  }

  const unsetCart = () => {
    localStorage.removeItem("express_cart_id")
    setCart(undefined)
  }

  return (
    <ExpressCartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        refreshCart,
        updateItemQuantity,
        unsetCart,
      }}
    >
      {children}
    </ExpressCartContext.Provider>
  )
}

export const useExpressCart = () => {
  const context = useContext(ExpressCartContext)
  if (!context) {
    throw new Error("useExpressCart must be used within an ExpressCartProvider")
  }
  return context
}
