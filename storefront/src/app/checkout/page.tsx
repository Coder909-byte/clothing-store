'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCart } from '@/lib/medusa'
import { formatPrice, CART_ID_KEY } from '@/lib/utils'

interface LineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string | null
}

interface Cart {
  id: string
  items?: LineItem[]
  subtotal?: number
  total?: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) {
      setLoading(false)
      return
    }
    getCart(cartId).then((c) => {
      setCart(c as Cart | null)
      setLoading(false)
    })
  }, [])

  const handlePlaceOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      alert('Payment integration coming soon')
      setPlacing(false)
    }, 300)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-stone-500">Loading...</p>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-display mb-4 text-3xl font-semibold text-olive-dark">Your cart is empty</h1>
        <Link href="/shop/all" className="text-olive underline underline-offset-2 hover:text-gold">
          Continue shopping
        </Link>
      </div>
    )
  }

  const subtotal = cart.subtotal ?? cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const total = subtotal + 99

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Checkout</h1>

      <div className="rounded-xl border border-olive/10 bg-ivory-cool p-6">
        <h2 className="mb-4 font-display text-xl font-semibold text-olive-dark">Order Summary</h2>

        <div className="space-y-3 border-b border-olive/10 pb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-stone-700">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 py-4">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-600">
            <span>Shipping</span>
            <span>{formatPrice(99)}</span>
          </div>
        </div>

        <div className="flex justify-between border-t border-olive/10 pt-4 text-base font-semibold text-olive-dark">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mt-6 w-full rounded-md bg-olive px-4 py-3 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark disabled:opacity-50"
        >
          {placing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
