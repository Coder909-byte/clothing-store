import type { Metadata } from 'next'
import CartPageClient from './CartPageClient'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your selected items and proceed to checkout.',
}

export default function CartPage() {
  return <CartPageClient />
}