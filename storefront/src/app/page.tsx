import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'

export const metadata: Metadata = {
  title: "Don't Tell Mama — Quiet Luxury",
  description:
    "Curated slow-fashion for the woman who knows exactly who she is. Timeless pieces, intentionally made in India.",
}

const CATEGORIES = [
  { handle: 'clothing', label: 'Clothing', tagline: 'Effortless silhouettes' },
  { handle: 'accessories', label: 'Accessories', tagline: 'Finishing touches' },
  { handle: 'home', label: 'Home', tagline: 'Objects with presence' },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
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

      {/* ── Category Grid ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </p>
          <h2 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
            Shop by Category
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const media = MEDIA.categories[cat.handle as keyof typeof MEDIA.categories]
            return (
              <Link
                key={cat.handle}
                href={`/shop/${cat.handle}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={media.fallback}
                    alt={cat.label}
                    width={600}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={false}
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-olive-dark/70 via-transparent to-transparent p-6 text-center">
                  <h3 className="font-display text-2xl font-semibold text-ivory">{cat.label}</h3>
                  <p className="mt-1 text-sm text-ivory/70">{cat.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured Banner ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-olive-dark py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            The Edit
          </p>
          <h2 className="font-display text-4xl font-semibold text-ivory sm:text-5xl lg:text-6xl">
            Timeless by Design.
            <br />
            <em className="font-normal not-italic text-gold">Intentional by Nature.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-ivory/70">
            We make fewer things, better. Every piece is designed to last decades
            and grow more beautiful with age.
          </p>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 border border-gold px-8 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-olive-dark"
          >
            Read Our Story <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Lookbook Strip ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-olive-dark">Lookbook</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MEDIA.home.lookbook.fallbacks.map((src, i) => (
            <div key={i} className="group aspect-square overflow-hidden rounded-md">
              <Image
                src={src}
                alt={`Lookbook image ${i + 1}`}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
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
