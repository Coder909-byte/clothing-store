'use client'

import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getCart } from '@/lib/medusa'
import { getCartId } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop/all' },
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      const cartId = getCartId()
      if (!cartId) {
        setCartCount(0)
        return
      }

      const cart = await getCart(cartId)
      if (cart?.items) {
        const totalItems = cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } else {
        setCartCount(0)
      }
    }

    fetchCartCount()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-olive/10 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-xl font-semibold tracking-tight text-olive whitespace-nowrap">
            Don&apos;t Tell Mama
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-stone-600 transition-colors hover:text-olive"
          >
            <Search size={20} />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="text-stone-600 transition-colors hover:text-olive"
          >
            <User size={20} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-stone-600 transition-colors hover:text-olive"
          >
            <ShoppingBag size={20} />
            {/* Cart count badge */}
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ivory">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="text-stone-600 transition-colors hover:text-olive md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-96 border-b border-olive/10' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col gap-1 bg-ivory px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-olive/10 hover:text-olive"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
