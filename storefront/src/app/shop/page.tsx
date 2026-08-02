import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { getProducts, getCategories } from '@/lib/medusa'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'The complete Don\'t Tell Mama collection — slow-fashion essentials designed to last.',
}

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; minPrice?: string; maxPrice?: string }>
}) {
  const { sort = 'created_at', category, minPrice, maxPrice } = await searchParams

  // Build filters for Medusa
  const filters: Record<string, unknown> = {}
  if (category && category !== 'all') {
    filters.category_handle = [category]
  }
  if (minPrice || maxPrice) {
    filters.variants = {
      ...(minPrice && { prices: { amount: { gte: parseInt(minPrice) * 100 } } }),
      ...(maxPrice && { prices: { amount: { lte: parseInt(maxPrice) * 100 } } }),
    }
  }

  const { products } = await getProducts({ ...filters, order: sort })
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10 border-b border-olive/10 pb-8">
        <nav className="mb-4 flex items-center gap-2 text-xs text-stone-400">
          <Link href="/" className="hover:text-olive">Home</Link>
          <span>/</span>
          <span className="text-stone-600">Shop</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-olive-dark">All Products</h1>
            <p className="mt-2 text-sm text-stone-500">{products.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              defaultValue={sort}
              name="sort"
              form="filter-form"
              className="rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm text-stone-700 focus:border-olive focus:outline-none"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters sidebar */}
        <aside className="lg:col-span-1">
          <form id="filter-form" action="/shop" method="GET" className="space-y-6">
            {/* Category filter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-700">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    defaultChecked={!category}
                    className="h-4 w-4 border-olive/30 text-olive focus:ring-gold"
                  />
                  All Categories
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm text-stone-600">
                    <input
                      type="radio"
                      name="category"
                      value={cat.handle}
                      defaultChecked={category === cat.handle}
                      className="h-4 w-4 border-olive/30 text-olive focus:ring-gold"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-700">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  defaultValue={minPrice}
                  className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
                />
                <span className="text-stone-400">—</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  defaultValue={maxPrice}
                  className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
                />
              </div>
            </div>

            {/* Hidden sort field */}
            <input type="hidden" name="sort" value={sort} />

            <button
              type="submit"
              className="w-full rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-olive-dark"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
              {products.map((product) => {
                const thumbnail = product.thumbnail || MEDIA.product(product.handle).thumbnail.fallback
                return (
                  <Link key={product.id} href={`/product/${product.handle}`} className="group">
                    <div className="aspect-[3/4] overflow-hidden rounded-md bg-ivory-warm">
                      <Image
                        src={thumbnail}
                        alt={product.title}
                        width={400}
                        height={533}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="text-sm font-medium text-stone-800 group-hover:text-olive transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm font-semibold text-olive">
                        {formatPrice((product.variants?.[0] as { prices?: { amount?: number }[] })?.prices?.[0]?.amount || 0)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="font-display text-2xl text-stone-400">No products found</p>
              <p className="text-sm text-stone-500">Try adjusting your filters or browse all products.</p>
              <Link href="/shop/all" className="inline-flex items-center gap-2 text-sm text-olive hover:underline">
                View all products <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}