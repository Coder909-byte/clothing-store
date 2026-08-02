import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { getProducts } from '@/lib/medusa'
import { formatPrice } from '@/lib/utils'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  all: {
    title: 'All Products',
    description: 'The complete Don\'t Tell Mama collection.',
  },
  clothing: {
    title: 'Clothing',
    description: 'Effortless silhouettes designed to last a lifetime.',
  },
  accessories: {
    title: 'Accessories',
    description: 'The finishing touches that complete the story.',
  },
  home: {
    title: 'Home',
    description: 'Objects with a quiet, confident presence.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category] ?? CATEGORY_META['all']!
  return {
    title: meta.title,
    description: meta.description,
  }
}

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default async function ShopCategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { sort = 'created_at' } = await searchParams
  const meta = CATEGORY_META[category] ?? CATEGORY_META['all']!

  // Fetch products from Medusa
  const filters: Record<string, unknown> = {}
  if (category !== 'all') {
    filters.category_handle = [category]
  }
  const { products } = await getProducts({ ...filters, order: sort })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10 border-b border-olive/10 pb-8">
        <nav className="mb-4 flex items-center gap-2 text-xs text-stone-400">
          <Link href="/" className="hover:text-olive">Home</Link>
          <span>/</span>
          <Link href="/shop/all" className="hover:text-olive">Shop</Link>
          {category !== 'all' && (
            <>
              <span>/</span>
              <span className="capitalize text-stone-600">{category}</span>
            </>
          )}
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-olive-dark">{meta.title}</h1>
            <p className="mt-2 text-sm text-stone-500">{products.length} products</p>
          </div>
          {/* Sort */}
          <select
            defaultValue={sort}
            className="rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm text-stone-700 focus:border-olive focus:outline-none"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Object.keys(CATEGORY_META).map((cat) => (
          <Link
            key={cat}
            href={`/shop/${cat}`}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              cat === category
                ? 'border-olive bg-olive text-ivory'
                : 'border-olive/20 text-stone-600 hover:border-olive hover:text-olive'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-3">
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

      {products.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="font-display text-2xl text-stone-400">No products found</p>
          <p className="text-sm text-stone-500">Try adjusting your filters or browse all products.</p>
          <Link href="/shop/all" className="inline-flex items-center gap-2 text-sm text-olive hover:underline">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}