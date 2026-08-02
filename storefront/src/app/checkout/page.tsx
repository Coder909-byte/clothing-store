import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase securely.',
}

const STEPS = ['Contact', 'Shipping', 'Payment']

export default function CheckoutPage() {
  const currentStep = 0 // Will be driven by state/router in real implementation

  return (
    <div className="min-h-screen bg-ivory">
      {/* Checkout header */}
      <header className="border-b border-olive/10 bg-ivory">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="font-display text-lg font-semibold text-olive">
            Don&apos;t Tell Mama
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Lock size={12} />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= currentStep ? 'bg-olive text-ivory' : 'bg-stone-200 text-stone-400'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= currentStep ? 'text-olive' : 'text-stone-400'}`}>
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <ChevronRight size={14} className="text-stone-300" />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <section className="rounded-lg border border-olive/10 bg-ivory-cool p-6">
              <h2 className="mb-5 font-display text-xl font-semibold text-olive-dark">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Email</label>
                  <input id="email" type="email" placeholder="you@example.com" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Phone</label>
                  <input id="phone" type="tel" placeholder="+91 98765 43210" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
              </div>
            </section>

            {/* Shipping address */}
            <section className="rounded-lg border border-olive/10 bg-ivory-cool p-6">
              <h2 className="mb-5 font-display text-xl font-semibold text-olive-dark">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">First Name</label>
                  <input id="first-name" type="text" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Last Name</label>
                  <input id="last-name" type="text" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address-line1" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Address</label>
                  <input id="address-line1" type="text" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">City</label>
                  <input id="city" type="text" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="pincode" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">PIN Code</label>
                  <input id="pincode" type="text" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">State</label>
                  <select id="state" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none">
                    <option value="">Select state…</option>
                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Rajasthan', 'Gujarat', 'Kerala'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Payment placeholder */}
            <section className="rounded-lg border border-olive/10 bg-ivory-cool p-6">
              <h2 className="mb-5 font-display text-xl font-semibold text-olive-dark">Payment</h2>
              <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-olive/30 bg-olive/5 py-8 text-center">
                <Lock size={24} className="text-olive/50" />
                <p className="text-sm font-medium text-stone-600">Razorpay payment integration</p>
                <p className="text-xs text-stone-400">
                  {/* TODO: Mount Razorpay checkout here */}
                  Wire up Razorpay SDK when RAZORPAY_KEY_ID is configured
                </p>
              </div>
            </section>

            <button
              id="place-order-btn"
              className="w-full rounded-md bg-olive py-4 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark active:scale-[0.99]"
            >
              Place Order
            </button>
          </div>

          {/* Order summary sidebar */}
          <div className="h-fit rounded-lg border border-olive/10 bg-ivory-cool p-6 lg:col-span-2">
            <h3 className="mb-4 font-display text-lg font-semibold text-olive-dark">Order Summary</h3>
            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>The Linen Tunic × 1</span>
                <span>₹4,200</span>
              </div>
              <div className="flex justify-between">
                <span>Woven Raffia Tote × 1</span>
                <span>₹2,400</span>
              </div>
            </div>
            <div className="mt-4 border-t border-olive/10 pt-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span><span>₹6,600</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span><span className="text-olive">Free</span>
              </div>
              <div className="mt-4 flex justify-between font-semibold">
                <span>Total</span><span className="text-olive">₹6,600</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
