import Medusa from '@medusajs/js-sdk'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL ?? 'http://localhost:9000'

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  debug: process.env.NODE_ENV === 'development',
})

// ─── Typed helpers ────────────────────────────────────────────────────────────

export async function getProducts(params?: Record<string, any>) {
  try {
    const { products, count, offset, limit } = await medusa.store.product.list(params)
    return { products, count, offset, limit }
  } catch (_e) {
    return { products: [], count: 0, offset: 0, limit: 0 }
  }
}

export async function getProduct(handle: string) {
  try {
    const { products } = await medusa.store.product.list({ handle })
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
  } catch (_e) {
    return null
  }
}

