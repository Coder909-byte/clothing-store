import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { getProducts } from '@/lib/medusa'
import { formatPrice } from '@/lib/utils'

export const revalidate = 0

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
  // Fetch all products first, then filter client-side by category
  const { products: allProducts } = await getProducts({ order: sort })
  
  // Map categories to product handles
  const categoryProductMap: Record<string, string[]> = {
    'fusion-sets': ['product-3'],
    'drapes': ['product-1'],
    'statement-sets': ['product-2', 'product-4', 'product-5'],
  }
  
  // Filter products by category if selected
  const products = category && category !== 'all' 
    ? allProducts.filter(p => categoryProductMap[category]?.includes(p.handle))
    : allProducts
  
  // Hardcoded categories matching actual product collections
  const categories = [
    { id: '1', name: 'Fusion Sets', handle: 'fusion-sets' },
    { id: '2', name: 'Drapes', handle: 'drapes' },
    { id: '3', name: 'Statement Sets', handle: 'statement-sets' },
  ]

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
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((product.variants?.[0]?.calculated_price?.calculated_amount || 0))}
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