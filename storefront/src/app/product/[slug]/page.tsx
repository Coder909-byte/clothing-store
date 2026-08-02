import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, ArrowLeft, ChevronRight } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

// Placeholder product data — replace with getProduct(slug) from Medusa
const PLACEHOLDER_PRODUCTS: Record<string, {
  title: string
  description: string
  price: number
  category: string
  categoryHandle: string
  details: string[]
  sizes: string[]
}> = {
  'linen-tunic': {
    title: 'The Linen Tunic',
    description:
      'A relaxed, breathable silhouette in pure European linen. Designed to be worn season after season — the kind of piece that becomes more yours with every wash.',
    price: 420000,
    category: 'Clothing',
    categoryHandle: 'clothing',
    details: ['100% European linen', 'Hand-finished seams', 'Relaxed fit — true to size', 'Machine wash cold, tumble dry low', 'Made in India'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
}

function getPlaceholderProduct(slug: string) {
  if (PLACEHOLDER_PRODUCTS[slug]) return PLACEHOLDER_PRODUCTS[slug]!
  // Generate a generic placeholder for any unknown slug
  return {
    title: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'A beautifully crafted piece designed to last a lifetime.',
    price: 350000,
    category: 'Clothing',
    categoryHandle: 'clothing',
    details: ['Natural fibres', 'Artisan-made', 'Made in India'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getPlaceholderProduct(slug)
  return {
    title: product.title,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getPlaceholderProduct(slug)
  const media = MEDIA.product(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-olive">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop/all" className="hover:text-olive">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop/${product.categoryHandle}`} className="capitalize hover:text-olive">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-stone-600">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ── Image Gallery ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Main image */}
          <div className="col-span-2 overflow-hidden rounded-lg">
            <Image
              src={media.images[0]!.fallback}
              alt={product.title}
              width={800}
              height={1000}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          {/* Secondary images */}
          {media.images.slice(1, 3).map((img, i) => (
            <div key={i} className="overflow-hidden rounded-md">
              <Image
                src={img.fallback}
                alt={`${product.title} — view ${i + 2}`}
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* ── Product Info ───────────────────────────────────────────── */}
        <div className="flex flex-col lg:py-4">
          {/* Badge */}
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            New Arrival
          </span>

          <h1 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-4 text-2xl font-semibold text-olive">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>

          {/* Size selector */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-700">Select Size</p>
              <button className="text-xs text-olive underline underline-offset-2 hover:text-gold">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="h-10 min-w-[48px] rounded-md border border-olive/20 px-3 text-sm font-medium text-stone-700 transition-all hover:border-olive hover:bg-olive hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              id="add-to-cart-btn"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-olive px-6 py-3.5 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-olive-dark active:scale-[0.98]"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
            <button
              aria-label="Save to wishlist"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-olive/20 text-stone-500 transition-all hover:border-olive hover:text-olive"
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Product details */}
          <div className="mt-10 border-t border-olive/10 pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-600">
              Product Details
            </h2>
            <ul className="space-y-2">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Back link */}
          <Link
            href={`/shop/${product.categoryHandle}`}
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-olive"
          >
            <ArrowLeft size={14} />
            Back to {product.category}
          </Link>
        </div>
      </div>
    </div>
  )
}
