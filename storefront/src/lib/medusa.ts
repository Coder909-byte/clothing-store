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
    // After deletion, retrieve the updated cart
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