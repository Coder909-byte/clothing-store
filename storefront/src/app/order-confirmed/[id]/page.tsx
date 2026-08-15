import Link from 'next/link'

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  const orderId = params.id

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-olive/10">
        <svg
          className="h-12 w-12 text-olive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h1 className="font-display mb-4 text-4xl font-semibold text-olive-dark">
        Thank you for your order!
      </h1>
      
      <p className="mb-8 text-lg text-stone-600">
        Your order has been placed successfully. We'll send you an email confirmation shortly.
      </p>

      {orderId !== 'success' && (
        <div className="mx-auto mb-8 max-w-md rounded-lg border border-olive/20 bg-ivory-cool p-4">
          <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Order Reference</p>
          <p className="mt-1 font-mono text-lg font-semibold text-olive-dark">{orderId}</p>
        </div>
      )}

      <Link
        href="/shop/all"
        className="inline-block rounded-md bg-olive px-8 py-3 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
