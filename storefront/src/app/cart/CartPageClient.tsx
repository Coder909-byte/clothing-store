'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { getCart, removeFromCart, updateCartLineItem } from '@/lib/medusa'
import { formatPrice, getCartId } from '@/lib/utils'

interface LineItem {
  id: string
  product_title?: string
  variant_title?: string
  quantity: number
  unit_price: number
  thumbnail?: string
  product_handle?: string
}

interface Cart {
  id: string
  items?: LineItem[]
}

interface CartItem {
  id: string
  title: string
  variant?: string
  quantity: number
  unit_price: number
  thumbnail?: string
  product_handle?: string
}

export default function CartPageClient() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = getCartId()
      if (!cartId) {
        setLoading(false)
        return
      }

      const cartData = await getCart(cartId)
      setCart(cartData)
      setLoading(false)
    }

    fetchCart()
  }, [])

  const handleRemoveItem = async (lineItemId: string) => {
    const cartId = getCartId()
    if (!cartId) return

    setUpdating(lineItemId)
    const updatedCart = await removeFromCart(cartId, lineItemId)
    if (updatedCart) {
      setCart(updatedCart)
    }
    setUpdating(null)
  }

  const handleUpdateQuantity = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const cartId = getCartId()
    if (!cartId) return

    setUpdating(lineItemId)
    const updatedCart = await updateCartLineItem(cartId, lineItemId, newQuantity)
    if (updatedCart) {
      setCart(updatedCart)
    }
    setUpdating(null)
  }

  const items: CartItem[] = cart?.items?.map((item: LineItem) => ({
    id: item.id,
    title: item.product_title || 'Unknown Product',
    variant: item.variant_title,
    quantity: item.quantity,
    unit_price: item.unit_price,
    thumbnail: item.thumbnail,
    product_handle: item.product_handle,
  })) || []

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const shipping = 99
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Your Cart</h1>
        <div className="flex items-center justify-center py-24">
          <div className="text-stone-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Your Cart</h1>
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <ShoppingBag size={48} className="text-stone-300" />
          <p className="font-display text-2xl text-stone-500">Your cart is empty</p>
          <Link
            href="/shop/all"
            className="inline-flex items-center gap-2 rounded-md bg-olive px-6 py-3 text-sm font-semibold text-ivory hover:bg-olive-dark"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border border-olive/10 bg-ivory-cool p-4"
              >
                {item.thumbnail && (
                  <Link href={`/product/${item.product_handle}`} className="shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={96}
                      height={120}
                      className="h-28 w-24 rounded-md object-cover"
                    />
                  </Link>
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {item.product_handle ? (
                        <Link href={`/product/${item.product_handle}`}>
                          <h3 className="font-medium text-stone-800 hover:text-olive">{item.title}</h3>
                        </Link>
                      ) : (
                        <h3 className="font-medium text-stone-800">{item.title}</h3>
                      )}
                      {item.variant && (
                        <p className="mt-0.5 text-xs text-stone-500">{item.variant}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      aria-label={`Remove ${item.title}`}
                      className="text-stone-400 transition-colors hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 rounded-md border border-olive/20">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="px-3 py-1.5 text-stone-600 hover:bg-olive/10 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="px-3 py-1.5 text-stone-600 hover:bg-olive/10 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-semibold text-olive">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop/all"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-olive"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-lg border border-olive/10 bg-ivory-cool p-6">
          <h2 className="mb-6 font-display text-xl font-semibold text-olive-dark">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <p className="text-xs text-stone-400">
              Shipping ₹99 on all orders
            </p>
          </div>

          <div className="mt-6 border-t border-olive/10 pt-6">
            <div className="flex justify-between font-semibold">
              <span className="text-stone-800">Total</span>
              <span className="text-olive">{formatPrice(total)}</span>
            </div>
            <p className="mt-1 text-xs text-stone-400">Incl. taxes where applicable</p>
          </div>

          <Link
            href="/checkout"
            id="proceed-to-checkout-btn"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-olive py-3.5 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark active:scale-[0.99]"
          >
            Proceed to Checkout <ArrowRight size={14} />
          </Link>

          {/* Coupon */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              className="flex-1 rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
              id="promo-code-input"
            />
            <button className="rounded-md border border-olive px-3 py-2 text-sm font-medium text-olive hover:bg-olive hover:text-ivory">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}