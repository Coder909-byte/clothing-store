'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Ruler } from 'lucide-react'
import { createCart, addToCart } from '@/lib/medusa'
import { formatPrice, getCartId, setCartId } from '@/lib/utils'
import CustomSizeForm from './CustomSizeForm'

interface ProductVariant {
  id: string
  title?: string | null
  calculated_price?: {
    calculated_amount?: number | null
  } | null
}

interface Product {
  id: string
  title: string
  description?: string | null
  variants?: ProductVariant[] | null
  categories?: { handle: string }[]
}

interface Props {
  product: Product
  categoryHandle: string
}

export default function ProductActions({ product, categoryHandle }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const primaryPrice = (product.variants?.[0]?.calculated_price?.calculated_amount || 0)

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    setIsAdding(true)
    try {
      // Get or create cart
      let cartId = getCartId()
      if (!cartId) {
        const newCart = await createCart('reg_01KZ8EA7BQRM4M5NTMN1C9GZX2')
        if (!newCart) throw new Error('Failed to create cart')
        cartId = newCart.id
        setCartId(cartId)
      }

      // Add item to cart
      const updatedCart = await addToCart(cartId, selectedSize, 1)
      if (!updatedCart) throw new Error('Failed to add to cart')

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      {/* Size selector */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-700">Select Size</p>
          <Link href="/size-chart" className="text-xs text-olive underline underline-offset-2 hover:text-gold">
            Size Guide
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedSize(variant.id)}
              className={`h-10 min-w-[48px] rounded-md border px-3 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selectedSize === variant.id
                  ? 'border-olive bg-olive text-ivory'
                  : 'border-olive/20 text-stone-700 hover:border-olive hover:bg-olive hover:text-ivory'
              }`}
            >
              {variant.title}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          id="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-olive px-6 py-3.5 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-olive-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={16} />
          {isAdding ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
        </button>
        <button
          aria-label="Save to wishlist"
          className="flex h-12 w-12 items-center justify-center rounded-md border border-olive/20 text-stone-500 transition-all hover:border-olive hover:text-olive"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* ── Customize Your Fit ────────────────────────────────────── */}
      <div className="mt-10 rounded-xl border border-olive/10 bg-ivory-cool p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-olive/10 p-2 text-olive">
            <Ruler size={20} />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-olive-dark">Customize Your Fit</h2>
            <p className="text-xs text-stone-500">Get a garment tailored to your exact measurements</p>
          </div>
        </div>
        <CustomSizeForm productId={product.id} productTitle={product.title} />
      </div>

      {/* Product details */}
      <div className="mt-10 border-t border-olive/10 pt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-600">
          Product Details
        </h2>
        <ul className="space-y-2">
          {product.description ? (
            <li className="flex items-start gap-2 text-sm text-stone-600">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {product.description}
            </li>
          ) : null}
          <li className="flex items-start gap-2 text-sm text-stone-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
            Made in India
          </li>
          <li className="flex items-start gap-2 text-sm text-stone-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
            Sustainably crafted
          </li>
        </ul>
      </div>

      {/* Back link */}
      <Link
        href={`/shop/${categoryHandle}`}
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-olive"
      >
        ← Back to {categoryHandle}
      </Link>
    </>
  )
}