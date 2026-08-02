import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'

export const metadata: Metadata = {
  title: 'About Us',
  description: "The story behind Don't Tell Mama — why we make fewer things, better.",
}

const VALUES = [
  {
    icon: '🌿',
    title: 'Slow by Design',
    body: 'We release small, considered collections rather than chasing seasonal trends. Every piece is designed to outlast them all.',
  },
  {
    icon: '🇮🇳',
    title: 'Made in India',
    body: 'We work with artisan workshops across India — people who have been perfecting their craft across generations.',
  },
  {
    icon: '♻️',
    title: 'Responsible Materials',
    body: 'Natural fibres, low-impact dyes, and packaging that composts. Because beautiful things shouldn\'t cost the earth.',
  },
  {
    icon: '🤝',
    title: 'Fair Wages Always',
    body: 'Every person in our supply chain earns above the living wage for their region. Non-negotiable.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Brand Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-20 sm:px-12 lg:px-16 lg:py-32">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our Story</p>
            <h1 className="font-display text-5xl font-semibold leading-tight text-olive-dark sm:text-6xl">
              Quiet luxury for<br />
              <em className="font-normal not-italic text-olive">the woman who</em><br />
              knows herself.
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-stone-600">
              Don&apos;t Tell Mama began in a Mumbai apartment in 2021 — a rejection of throwaway fashion and a love letter to the things worth keeping. We believe a wardrobe should feel like a collection of trusted companions, not a catalogue of regrets.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-stone-600">
              We make fewer pieces than most brands. We take longer to design them. We work with craftspeople who care as much as we do.
            </p>
            <Link
              href="/shop/all"
              className="mt-10 inline-flex w-fit items-center gap-2 rounded-none border border-olive bg-olive px-8 py-3 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark"
            >
              Shop the Collection <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative min-h-[400px] bg-olive-dark/10 lg:min-h-0">
            <Image
              src={MEDIA.about.brand.fallback}
              alt="Don't Tell Mama brand story"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-olive-dark">What We Stand For</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon, title, body }) => (
            <div key={title} className="rounded-xl border border-olive/10 bg-ivory-cool p-6">
              <span className="mb-4 block text-3xl">{icon}</span>
              <h3 className="mb-2 font-display text-lg font-semibold text-olive-dark">{title}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────────── */}
      <section className="bg-olive-dark py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-semibold text-ivory">The People Behind the Label</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {MEDIA.about.team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={member.fallback}
                    alt={`Team member ${i + 1}`}
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-display text-lg font-semibold text-ivory">Team Member {i + 1}</p>
                <p className="text-sm text-ivory/60">Co-founder</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
