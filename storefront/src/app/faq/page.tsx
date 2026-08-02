import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ',
  description: "Frequently asked questions about Don't Tell Mama — shipping, returns, sizing, and more.",
}

const FAQS = [
  {
    q: 'Do you ship across India?',
    a: 'Yes, we ship to all major cities and pin codes across India via trusted courier partners. Standard delivery takes 5–7 business days.',
  },
  {
    q: 'Is shipping free?',
    a: 'Standard shipping is free on all orders above ₹2,000. For orders below this, a flat shipping fee of ₹99 applies.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of delivery. Items must be in their original condition — unworn, unwashed, and in original packaging. Sale items are final sale.',
  },
  {
    q: 'How do I know which size to choose?',
    a: 'Each product page includes a detailed size guide. Our clothing runs true to size unless otherwise noted. When in doubt, we recommend sizing up.',
  },
  {
    q: 'What fabrics do you use?',
    a: 'We work with natural fibres — primarily linen, cotton, wool, and silk — sourced from responsible suppliers. Each product listing details the exact materials.',
  },
  {
    q: 'Can I modify or cancel my order?',
    a: 'Orders can be modified or cancelled within 2 hours of placing them. After that, our fulfilment process begins. Please email orders@donttellmama.in as soon as possible.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Yes! Select gift wrapping at checkout. We use recycled kraft paper and tie with a cotton ribbon — no extra plastic.',
  },
  {
    q: 'How do I care for my garments?',
    a: 'Care instructions are printed inside each garment and listed on every product page. As a general rule: cold wash, gentle cycle, lay flat to dry.',
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Support</p>
        <h1 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-stone-500">
          Can&apos;t find your answer?{' '}
          <a href="/contact" className="text-olive underline underline-offset-2 hover:text-gold">
            Contact us
          </a>
        </p>
      </div>

      <div className="divide-y divide-olive/10">
        {FAQS.map(({ q, a }, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <h2 className="text-base font-medium text-stone-800 group-open:text-olive">{q}</h2>
              <ChevronDown
                size={18}
                className="shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180 group-open:text-olive"
              />
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
