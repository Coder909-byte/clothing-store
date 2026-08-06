import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getProduct } from '@/lib/medusa'
import { MEDIA } from '@/lib/cloudinary'
import ProductActions from './ProductActions'

interface ProductVariant {
  id: string
  title?: string | null
  calculated_price?: {
    calculated_amount: number
  }
}

interface Product {
  id: string
  title: string
  description?: string | null
  thumbnail?: string | null
  variants?: ProductVariant[] | null
  categories?: { handle: string }[]
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.title,
    description: product.description || `Shop ${product.title} at Don't Tell Mama`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) throw new Error('Product not found')

  const media = MEDIA.product(slug)
  const primaryPrice = (product.variants?.[0]?.calculated_price?.calculated_amount || 0)
  const categoryHandle = product.categories?.[0]?.handle || 'clothing'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-olive">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop/all" className="hover:text-olive">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop/${categoryHandle}`} className="capitalize hover:text-olive">{categoryHandle}</Link>
        <ChevronRight size={12} />
        <span className="text-stone-600">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ── Image Gallery ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Main image */}
          <div className="col-span-2 overflow-hidden rounded-lg">
            <Image
              src={product.thumbnail || media.images[0]!.fallback}
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
            {primaryPrice ? `₹${primaryPrice.toLocaleString('en-IN')}` : 'Price on request'}
          </p>

          <p className="mt-6 leading-relaxed text-stone-600">{product.description || 'A beautifully crafted piece designed to last a lifetime.'}</p>

          {/* Client component for interactive elements */}
          <ProductActions product={product} categoryHandle={categoryHandle} />
        </div>
      </div>
    </div>
  )
}