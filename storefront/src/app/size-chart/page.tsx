import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Ruler } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'

export const metadata: Metadata = {
  title: 'Size Chart',
  description: 'Find your perfect fit with our detailed size charts and measurement guide.',
}

const SIZE_CHARTS: Record<string, { title: string; sizes: { size: string; bust: string; waist: string; hip: string; length: string }[]; care: string[] }> = {
  clothing: {
    title: 'Clothing',
    sizes: [
      { size: 'XS', bust: '34" / 86 cm', waist: '26" / 66 cm', hip: '36" / 91 cm', length: '42" / 107 cm' },
      { size: 'S', bust: '36" / 91 cm', waist: '28" / 71 cm', hip: '38" / 97 cm', length: '43" / 109 cm' },
      { size: 'M', bust: '38" / 97 cm', waist: '30" / 76 cm', hip: '40" / 102 cm', length: '44" / 112 cm' },
      { size: 'L', bust: '40" / 102 cm', waist: '32" / 81 cm', hip: '42" / 107 cm', length: '45" / 114 cm' },
      { size: 'XL', bust: '42" / 107 cm', waist: '34" / 86 cm', hip: '44" / 112 cm', length: '46" / 117 cm' },
    ],
    care: [
      'Machine wash cold with similar colors',
      'Gentle cycle',
      'Do not bleach',
      'Tumble dry low or lay flat to dry',
      'Iron on low heat if needed',
      'Professional dry cleaning recommended for silk and wool',
    ],
  },
  accessories: {
    title: 'Accessories',
    sizes: [
      { size: 'One Size', bust: 'N/A', waist: 'N/A', hip: 'N/A', length: 'Adjustable' },
    ],
    care: [
      'Store in a cool, dry place',
      'Avoid contact with water, perfumes, and cosmetics',
      'Clean with a soft, dry cloth',
      'Keep away from direct sunlight to prevent fading',
    ],
  },
  home: {
    title: 'Home',
    sizes: [
      { size: 'Small', bust: '12" / 30 cm', waist: '12" / 30 cm', hip: '12" / 30 cm', length: '18" / 45 cm' },
      { size: 'Medium', bust: '16" / 40 cm', waist: '16" / 40 cm', hip: '16" / 40 cm', length: '24" / 60 cm' },
      { size: 'Large', bust: '20" / 50 cm', waist: '20" / 50 cm', hip: '20" / 50 cm', length: '30" / 75 cm' },
    ],
    care: [
      'Spot clean only for most items',
      'Use mild detergent if washing is required',
      'Air dry completely before storing',
      'Keep away from direct heat sources',
      'For candles: trim wick to 1/4" before each use',
    ],
  },
}

export default function SizeChartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-olive">Home</Link>
        <span>/</span>
        <span className="text-stone-600">Size Chart</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">Size Chart</h1>
        <p className="mt-4 text-stone-600">
            Not sure about your size? We've got you covered. Below are our detailed size charts for each category.
          If you need help, reach out to us at <a href="mailto:sizing@donttellmama.in" className="text-olive underline underline-offset-2 hover:text-gold">sizing@donttellmama.in</a>.
        </p>
      </div>

      {/* How to Measure */}
      <section className="mb-16 rounded-xl border border-olive/10 bg-ivory-cool p-8 sm:p-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold text-olive-dark">How to Measure</h2>
          <p className="mt-2 text-stone-600">For the best fit, take your measurements over undergarments.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-ivory-warm">
              <Image
                src={MEDIA.about.brand.fallback}
                alt="Bust measurement"
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-display text-lg font-semibold text-olive-dark">Bust</h3>
            <p className="mt-1 text-sm text-stone-600">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
          </div>
          <div>
            <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-ivory-warm">
              <Image
                src={MEDIA.about.brand.fallback}
                alt="Waist measurement"
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-display text-lg font-semibold text-olive-dark">Waist</h3>
            <p className="mt-1 text-sm text-stone-600">Measure around your natural waistline, the narrowest part of your torso.</p>
          </div>
          <div>
            <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-ivory-warm">
              <Image
                src={MEDIA.about.brand.fallback}
                alt="Hip measurement"
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-display text-lg font-semibold text-olive-dark">Hip</h3>
            <p className="mt-1 text-sm text-stone-600">Measure around the fullest part of your hips, about 8" below your waist.</p>
          </div>
        </div>
      </section>

      {/* Size Charts by Category */}
      {Object.entries(SIZE_CHARTS).map(([key, category]) => (
        <section key={key} className="mb-16">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-semibold text-olive-dark">{category.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-olive/20">
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-stone-700">Size</th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-stone-700">Bust</th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-stone-700">Waist</th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-stone-700">Hip</th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-stone-700">Length</th>
                </tr>
              </thead>
              <tbody>
                {category.sizes.map((size, i) => (
                  <tr key={size.size} className={i % 2 === 0 ? 'bg-ivory-cool' : 'bg-ivory'}>
                    <td className="px-4 py-3 font-semibold text-olive">{size.size}</td>
                    <td className="px-4 py-3 text-stone-700">{size.bust}</td>
                    <td className="px-4 py-3 text-stone-700">{size.waist}</td>
                    <td className="px-4 py-3 text-stone-700">{size.hip}</td>
                    <td className="px-4 py-3 text-stone-700">{size.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Care Instructions */}
          <div className="mt-8 rounded-lg border border-olive/10 bg-ivory-warm p-6">
            <h3 className="mb-3 font-display text-lg font-semibold text-olive-dark">Garment Care</h3>
            <ul className="space-y-2">
              {category.care.map((instruction, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* Custom Fitting CTA */}
      <section className="rounded-2xl border border-olive/10 bg-olive-dark p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-gold/20 p-3 text-gold">
            <Ruler size={28} />
          </div>
          <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">Need a Custom Fit?</h2>
          <p className="mt-4 text-ivory/80">
            We offer custom tailoring services for all our garments. Visit any product page and use the "Customize Your Fit" feature to share your measurements with us.
          </p>
          <Link
            href="/shop/all"
            className="mt-8 inline-flex items-center gap-2 border border-gold px-8 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-olive-dark"
          >
            Shop Now <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  )
}