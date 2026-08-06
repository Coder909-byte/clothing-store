import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Ruler } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'
import { getProducts } from '@/lib/medusa'

export const metadata: Metadata = {
  title: "Don&apos;t Tell Mama — Quiet Luxury",
  description:
    "Curated slow-fashion for the woman who knows exactly who she is. Timeless pieces, intentionally made in India.",
}

const CATEGORIES = [
  { handle: 'clothing', label: 'Clothing', tagline: 'Effortless silhouettes' },
  { handle: 'accessories', label: 'Accessories', tagline: 'Finishing touches' },
  { handle: 'home', label: 'Home', tagline: 'Objects with presence' },
]

export default async function HomePage() {
  // Fetch featured products (first 8) from Medusa
  const { products: featuredProducts } = await getProducts({ limit: 8 })

  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden bg-olive-dark">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={MEDIA.home.hero.fallbackPosterUrl}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={MEDIA.home.hero.fallbackVideoUrl} type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-olive-dark/60 via-olive-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory/80 via-transparent to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            New Collection — Monsoon &apos;25
          </p>
          <h1 className="font-display text-5xl font-semibold text-ivory drop-shadow-sm sm:text-6xl lg:text-8xl">
            Don&apos;t Tell Mama
          </h1>
          <p className="mt-6 max-w-md text-base text-ivory/80 sm:text-lg">
            Quiet luxury for the woman who knows exactly who she is.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop/all"
              className="group inline-flex items-center gap-2 rounded-none border border-ivory bg-ivory px-8 py-3 text-sm font-semibold text-olive transition-all duration-300 hover:bg-olive hover:text-ivory"
            >
              Shop the Collection
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-ivory/40 px-8 py-3 text-sm font-medium text-ivory transition-all duration-300 hover:border-ivory"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-olive/60" />
        </div>
      </section>

      {/* ── Shop by Category — Category Tiles ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </p>
          <h2 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
            Shop by Category
          </h2>
        </div>

        {/* Hardcoded category-to-product mappings */}
        {(() => {
          // Build a lookup map from product handle to product
          const productMap = new Map(
            featuredProducts.map((p) => [p.handle, p])
          )

          const categories = [
            {
              slug: 'fusion-sets',
              label: 'Fusion Sets',
              productHandles: ['product-3'], // Ivory Dust
            },
            {
              slug: 'drapes',
              label: 'Drapes',
              productHandles: ['product-1'], // Golden Haze
            },
            {
              slug: 'statement-sets',
              label: 'Statement Sets',
              productHandles: ['product-2', 'product-4', 'product-5'], // Celestial Maze, Cocoa Dusk, Moonveil
            },
          ]

          return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                // Use the first product's image for the tile background
                const firstProduct = productMap.get(cat.productHandles[0])
                const thumbnail =
                  firstProduct?.thumbnail ||
                  MEDIA.product(firstProduct?.handle ?? cat.slug).thumbnail.fallback

                return (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    className="group relative aspect-[3/4] overflow-hidden rounded-lg"
                  >
                    {/* Full-bleed background image */}
                    <Image
                      src={thumbnail}
                      alt={cat.label}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={false}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-olive-dark/40 transition-all duration-300 group-hover:bg-olive-dark/50" />

                    {/* Centered SHOP NOW overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h3 className="mb-4 font-display text-2xl font-semibold text-ivory">
                        {cat.label}
                      </h3>
                      <div className="border border-ivory px-8 py-3 transition-all duration-300 group-hover:scale-105">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
                          Shop Now
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })()}
      </section>

      {/* ── Featured Collection ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Curated Selection
            </p>
            <h2 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
              Featured Collection
            </h2>
          </div>
          <Link
            href="/shop/all"
            className="hidden items-center gap-2 text-sm font-medium text-olive transition-colors hover:text-gold sm:flex"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 5).map((product) => {
            const thumbnail = product.thumbnail || MEDIA.product(product.handle).thumbnail.fallback
            const price = (product.variants?.[0]?.calculated_price?.calculated_amount || 0)
            return (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[3/4] overflow-hidden bg-ivory-warm">
                  <Image
                    src={thumbnail}
                    alt={product.title}
                    width={600}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={false}
                  />
                </div>
                {/* Price overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-olive-dark/40 p-6 transition-all duration-300 group-hover:bg-olive-dark/50">
                  <p className="text-xl font-semibold text-ivory">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(price)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view all link */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/shop/all"
            className="inline-flex items-center gap-2 text-sm font-medium text-olive"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Brand Story ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Our Story
            </p>
            <h2 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
              Made with Intention
            </h2>
            <div className="mt-6 space-y-4 text-stone-600">
              <p>
                Don&apos;t Tell Mama began in a Mumbai apartment in 2021 — a rejection of throwaway fashion and a love letter to the things worth keeping. We believe a wardrobe should feel like a collection of trusted companions, not a catalogue of regrets.
              </p>
              <p>
                We make fewer pieces than most brands. We take longer to design them. We work with craftspeople who care as much as we do. Every stitch, every seam, every fabric choice is intentional.
              </p>
              <p>
                Our garments are designed to last decades and grow more beautiful with age. Because true luxury isn&apos;t about logos — it&apos;s about knowing what you love and sticking with it.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 border border-olive px-6 py-3 text-sm font-semibold text-olive transition-all duration-300 hover:bg-olive hover:text-ivory"
            >
              Read Our Full Story <ArrowRight size={16} />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={MEDIA.about.brand.fallback}
                alt="Don&apos;t Tell Mama brand story"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery / Moodboard ────────────────────────────────────────── */}
      <section className="bg-olive-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Moodboard
            </p>
            <h2 className="font-display text-4xl font-semibold text-ivory sm:text-5xl">
              The DTM Aesthetic
            </h2>
          </div>
          <div className="marquee-container">
            <div className="marquee-track">
              {featuredProducts.slice(0, 5).map((product) => {
                const thumbnail = product.thumbnail || MEDIA.product(product.handle).thumbnail.fallback
                return (
                  <div key={product.id} className="marquee-item">
                    <Image
                      src={thumbnail}
                      alt={product.title}
                      width={800}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
              })}
              {featuredProducts.slice(0, 5).map((product) => {
                const thumbnail = product.thumbnail || MEDIA.product(product.handle).thumbnail.fallback
                return (
                  <div key={`duplicate-${product.id}`} className="marquee-item">
                    <Image
                      src={thumbnail}
                      alt={product.title}
                      width={800}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Size Chart CTA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-olive/10 bg-ivory-cool p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-olive/10 p-3 text-olive">
                <Ruler size={24} />
              </div>
              <h2 className="font-display text-3xl font-semibold text-olive-dark sm:text-4xl">
                Find Your Perfect Fit
              </h2>
              <p className="mt-4 text-stone-600">
                Not sure about sizing? Our detailed size charts and custom fitting service ensure your garment fits you perfectly. Every body is unique — we celebrate that.
              </p>
              <Link
                href="/size-chart"
                className="mt-6 inline-flex items-center gap-2 border border-olive px-6 py-3 text-sm font-semibold text-olive transition-all duration-300 hover:bg-olive hover:text-ivory"
              >
                View Size Charts <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="aspect-square max-w-xs w-full rounded-lg bg-ivory-warm p-8">
                <Image
                  src={MEDIA.about.brand.fallback}
                  alt="Size guide"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ─────────────────────────────────────────────────── */}
      <section className="border-y border-olive/10 bg-ivory-warm py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { icon: '🌿', label: 'Sustainably Made' },
              { icon: '🇮🇳', label: 'Crafted in India' },
              { icon: '📦', label: 'Free Shipping ₹2000+' },
              { icon: '↩️', label: '30-Day Returns' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}