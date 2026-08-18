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
  } catch (_e) {
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
  } catch (_e) {
    return null
  }
}

export async function getCategories() {
  try {
    const { product_categories } = await medusa.store.category.list()
    return product_categories
  } catch (_e) {
    return []
  }
}

export async function getCart(cartId: string) {
  try {
    const { cart } = await medusa.store.cart.retrieve(cartId)
    return cart
  } catch (_e) {
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

export async function addToCart(cartId: string, variantId: string, quantity: number = 1, metadata?: Record<string, unknown>) {
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
  } catch (_e) {
    return null
  }
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  try {
    const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    })
    return cart
  } catch (_e) {
    return null
  }
}

export async function updateCart(cartId: string, data: Record<string, any>) {
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
    // Log to see the exact structure
    console.log('createPaymentSessions response:', JSON.stringify(response, null, 2))
    // Return the whole response – we'll parse it in the page
    return response
  } catch (e) {
    console.error('createPaymentSessions error:', e)
    return null
  }
}

export async function completeCart(cartId: string) {
  try {
    // @ts-ignore
    const response = await medusa.store.cart.complete(cartId)
    return response
  } catch (e) {
    console.error('completeCart error:', e)
    return { error: e }
  }
}

// ─── updateCustomerPhone (raw fetch, per gotcha #8) ────────────────────────

export async function updateCustomerPhone(phone: string) {
  try {
    const token = localStorage.getItem('dtm_auth_token')
    if (!token) {
      console.warn('No auth token found, cannot update customer phone')
      return null
    }

    const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? '',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to update customer phone: ${res.status} ${errorText}`)
    }

    const data = await res.json()
    return data.customer
  } catch (e) {
    console.error('updateCustomerPhone error:', e)
    return null
  }
}