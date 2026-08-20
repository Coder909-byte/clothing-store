'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { getCart, updateCart, getShippingOptions, addShippingMethod, createPaymentSessions, completeCart, updateCustomerPhone } from '@/lib/medusa'
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
  payment_sessions?: any[]
  payment_session?: any
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart) return

    setPlacing(true)
    setError('')

    try {
      // 1. Update cart with shipping address and email
      console.log('DEBUG phone value:', phone, 'email:', email)
      const updatedCart = await updateCart(cart.id, {
        email,
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address_1: address,
          city,
          postal_code: postalCode,
          phone,
          country_code: 'in',
        },
      })

      if (!updatedCart) throw new Error('Failed to update cart address')

      // 2. Update customer's phone (required for Razorpay)
      const customer = await updateCustomerPhone(phone)
      if (!customer) {
        console.warn('Could not update customer phone, but continuing')
      }

      // 3. Add shipping method
      const options = await getShippingOptions(updatedCart.id)
      if (!options || options.length === 0) {
        throw new Error('No shipping options available. Please contact support.')
      }

      await addShippingMethod(updatedCart.id, options[0].id)

      // 4. Re-fetch cart to get the updated shipping method
      const refreshedCart = await getCart(updatedCart.id)
      if (!refreshedCart) throw new Error('Failed to refresh cart after adding shipping method')

      // 5. Create payment session using the refreshed cart (full object)
      const paymentResponse = await createPaymentSessions(refreshedCart)
      if (!paymentResponse) throw new Error('Failed to create payment session')

      // Extract payment collection and sessions
      const paymentCollection = paymentResponse.payment_collection || paymentResponse
      const sessions = paymentCollection?.payment_sessions || []

      // Find the Razorpay session
      const razorpaySession = sessions.find((s: any) => s.provider_id === 'pp_razorpay_razorpay')
      if (!razorpaySession) {
        console.error('No Razorpay session found in:', sessions)
        throw new Error('Razorpay session not found')
      }

      // Order ID is inside session.data
      const sessionData = razorpaySession.data
      if (!sessionData?.id) {
        console.error('No order ID in session data:', sessionData)
        throw new Error('Razorpay order ID missing')
      }

      const orderId = sessionData.id

      // Ensure Razorpay script is loaded
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK not loaded')
      }

      // 6. Open Razorpay modal
      const totalAmount = refreshedCart.total ?? (refreshedCart.subtotal ?? 0) + 9900
      const rzpOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount,
        currency: 'INR',
        name: "Don't Tell Mama",
        description: 'Order Payment',
        order_id: orderId,
        prefill: {
          name: `${firstName} ${lastName}`,
          email,
          contact: phone,
        },
        theme: {
          color: '#6B7A4A',
        },
        handler: async function (response: any) {
          try {
            // Use refreshedCart.id for completion
            const result = await completeCart(refreshedCart.id)
            if ('error' in result) {
              console.error('Error completing cart:', result.error)
              setError('Payment succeeded but failed to complete order. Please contact support.')
              setPlacing(false)
            } else {
              localStorage.removeItem(CART_ID_KEY)
              router.push(`/order-confirmed/${result.order?.id || 'success'}`)
            }
          } catch (err: any) {
            console.error('Handler error:', err)
            setError(err.message || 'Error processing completion')
            setPlacing(false)
          }
        },
      }

      const rzp = new (window as any).Razorpay(rzpOptions)
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed', response.error)
        setError('Payment failed. Please try again.')
        setPlacing(false)
      })
      rzp.open()

    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong during checkout.')
      setPlacing(false)
    }
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
  const total = cart.total ?? (subtotal + 9900)

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Checkout</h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Form Section */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="rounded-xl border border-olive/10 bg-ivory-cool p-6">
              <h2 className="mb-6 font-display text-2xl font-semibold text-olive-dark">Contact & Shipping</h2>
              
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email Address</label>
                  <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-stone-700">First Name</label>
                    <input type="text" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-stone-700">Last Name</label>
                    <input type="text" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-stone-700">Street Address</label>
                  <input type="text" id="address" required value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-stone-700">City</label>
                    <input type="text" id="city" required value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-stone-700">Postal Code</label>
                    <input type="text" id="postalCode" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-700">Phone</label>
                  <input type="tel" id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border border-olive/20 px-3 py-2 outline-none focus:border-olive focus:ring-1 focus:ring-olive" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full rounded-md bg-olive px-4 py-4 text-base font-semibold text-ivory transition-all hover:bg-olive-dark disabled:opacity-50"
            >
              {placing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>

          {/* Order Summary Section */}
          <div>
            <div className="sticky top-24 rounded-xl border border-olive/10 bg-ivory p-6">
              <h2 className="mb-4 font-display text-xl font-semibold text-olive-dark">Order Summary</h2>

              <div className="space-y-4 border-b border-olive/10 pb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 text-sm">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-stone-800">{item.title}</h3>
                      <p className="text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-stone-800">{formatPrice(item.unit_price * item.quantity)}</span>
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
                  <span>{formatPrice(9900)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t border-olive/10 pt-4 text-lg font-semibold text-olive-dark">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}