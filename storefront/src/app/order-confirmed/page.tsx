'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <CheckCircle size={56} className="mx-auto mb-6 text-olive" />
      <h1 className="font-display mb-3 text-4xl font-semibold text-olive-dark">
        Order Confirmed
      </h1>
      <p className="mb-2 text-stone-600">
        Thank you for your order! We've received it and will begin preparing your piece.
      </p>
      <p className="mb-8 text-sm text-stone-500">
        A confirmation email is on its way to your inbox with your order details.
      </p>

      <div className="rounded-xl border border-olive/10 bg-ivory-cool p-6 text-left">
        <h2 className="mb-2 font-display text-lg font-semibold text-olive-dark">
          What happens next
        </h2>
        <ul className="space-y-2 text-sm text-stone-600">
          <li>We'll confirm your measurements within a few hours of your order.</li>
          <li>Your piece is made to order — production typically takes 2–3 weeks.</li>
          <li>You'll receive tracking details by email once it ships.</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop/all"
          className="inline-flex items-center gap-2 rounded-none border border-olive bg-olive px-8 py-3 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 border border-olive/40 px-8 py-3 text-sm font-medium text-olive-dark transition-all hover:border-olive"
        >
          View Order
        </Link>
      </div>
    </div>
  )
}
