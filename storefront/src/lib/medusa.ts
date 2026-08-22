import Medusa from '@medusajs/js-sdk'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL ?? 'http://localhost:9000'

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// ─── Typed helpers ────────────────────────────────────────────────────────────
const DEFAULT_REGION_ID = 'reg_01KZ8EA7BQRM4M5NTMN1C9GZX2'

export async function getProducts(params?: Record<string, unknown>) {
  try {
    const { products, count, offset, limit } = await medusa.store.product.list({
      region_id: DEFAULT_REGION_ID,
      fields: 'id,title,handle,thumbnail,*images,variants.title,variants.id,*variants.calculated_price,metadata',
      ...params,
    })
    return { products, count, offset, limit }
  } catch {
    return { products: [], count: 0, offset: 0, limit: 0 }
  }
}

export async function getProduct(handle: string) {
  try {
    const { products } = await medusa.store.product.list({
      handle,
      region_id: DEFAULT_REGION_ID,
      fields: 'id,title,handle,thumbnail,*images,variants.title,variants.id,*variants.calculated_price,metadata',
    })
    if (!products || !products.length) return null
    return products[0] ?? null
  } catch {
    return null
  }
}

export async function getCategories() {
  try {
    const { product_categories } = await medusa.store.category.list()
    return product_categories
  } catch {
    return []
  }
}

export async function getCart(cartId: string) {
  try {
    const { cart } = await medusa.store.cart.retrieve(cartId, {
      fields: 'id,items,subtotal,total,customer.id,customer.email,customer.phone,customer.first_name,customer.last_name,shipping_address,billing_address,payment_sessions,payment_session,email,region',
    })
    return cart
  } catch {
    return null
  }
}

export async function createCart(regionId: string) {
  try {
    const { cart } = await medusa.store.cart.create({ region_id: regionId })
    return cart
  } catch (e) {
    console.error('createCart error:', e)
    return null
  }
}

export async function addToCart(cartId: string, variantId: string, quantity = 1, metadata?: Record<string, unknown>) {
  try {
    const { cart } = await medusa.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
      metadata,
    })
    return cart
  } catch (e) {
    console.error('addToCart error:', e)
    return null
  }
}

export async function removeFromCart(cartId: string, lineItemId: string) {
  try {
    await medusa.store.cart.deleteLineItem(cartId, lineItemId)
    return await getCart(cartId)
  } catch {
    return null
  }
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  try {
    const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    })
    return cart
  } catch {
    return null
  }
}

export async function updateCart(cartId: string, data: Record<string, unknown>) {
  try {
    const { cart } = await medusa.store.cart.update(cartId, data)
    return cart
  } catch (e) {
    console.error('updateCart error:', e)
    return null
  }
}

export async function getShippingOptions(cartId: string) {
  try {
    const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
      cart_id: cartId,
    })
    return shipping_options
  } catch (e) {
    console.error('getShippingOptions error:', e)
    return []
  }
}

export async function addShippingMethod(cartId: string, optionId: string) {
  try {
    const { cart } = await medusa.store.cart.addShippingMethod(cartId, {
      option_id: optionId,
    })
    return cart
  } catch (e) {
    console.error('addShippingMethod error:', e)
    return null
  }
}

export async function createPaymentSessions(cart: any) {
  try {
    const response = await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: 'pp_razorpay_razorpay',
    })
    return response
  } catch (e) {
    console.error('createPaymentSessions error:', e)
    return null
  }
}

export async function completeCart(cartId: string) {
  try {
    const response = await medusa.store.cart.complete(cartId)
    return response
  } catch (e) {
    console.error('completeCart error:', e)
    return { error: e }
  }
}

// ─── updateCustomerPhone (via direct DB API route, bypasses auth entirely) ──
export async function updateCustomerPhone(cartId: string, phone: string) {
  try {
    const res = await fetch('/api/set-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_id: cartId, phone }),
    })
    if (!res.ok) {
      console.warn('set-phone failed:', await res.text())
      return null
    }
    return await res.json()
  } catch (e) {
    console.error('updateCustomerPhone error:', e)
    return null
  }
}