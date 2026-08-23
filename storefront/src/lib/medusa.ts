import Medusa from '@medusajs/js-sdk'
import { CART_ID_KEY } from './utils'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL ?? 'http://localhost:9000'

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const DEFAULT_REGION_ID = 'reg_01KZ8EA7BQRM4M5NTMN1C9GZX2'

// ─── Products ──────────────────────────────────────────────────────────────────
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
    return products?.[0] ?? null
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

// ─── Cart ──────────────────────────────────────────────────────────────────────
export async function getCart(cartId: string) {
  try {
    const { cart } = await medusa.store.cart.retrieve(cartId, {
      fields: 'id,items,subtotal,total,customer.id,customer.email,customer.phone,customer.first_name,customer.last_name,shipping_address,billing_address,payment_sessions,payment_session,payment_collection,email,region,shipping_methods',
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
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status
    if (status === 404) {
      // Stale/invalid cart id (e.g. cart was deleted or belongs to a wiped dev DB).
      // Clear it, start a fresh cart, and retry the add once.
      console.warn('addToCart: cart not found, creating a fresh cart and retrying:', cartId)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_ID_KEY)
      }
      const newCart = await createCart(DEFAULT_REGION_ID)
      if (!newCart) {
        console.error('addToCart error: failed to create replacement cart after 404')
        return null
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_ID_KEY, newCart.id)
      }
      try {
        const { cart } = await medusa.store.cart.createLineItem(newCart.id, {
          variant_id: variantId,
          quantity,
          metadata,
        })
        return cart
      } catch (retryErr) {
        console.error('addToCart error: retry after fresh cart failed:', retryErr)
        return null
      }
    }
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
    const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity })
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

// ─── Shipping ──────────────────────────────────────────────────────────────────
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
  const { cart } = await medusa.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  })
  return cart
}
// ─── Payment ──────────────────────────────────────────────────────────────────
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

// ─── Order ────────────────────────────────────────────────────────────────────
export async function completeCart(cartId: string) {
  try {
    const response = await medusa.store.cart.complete(cartId)
    return response
  } catch (e) {
    console.error('completeCart error:', e)
    return { error: e }
  }
}