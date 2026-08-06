import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Ruler } from 'lucide-react'
import { MEDIA } from '@/lib/cloudinary'

export const metadata: Metadata = {
  title: 'Size Chart',
  description: 'Find your perfect fit with our detailed size guide and measurement reference.',
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
          Not sure about your size? We&apos;re here to help you find the perfect fit.
        </p>
      </div>

      {/* Size Guide Image */}
      <div className="mb-16 flex justify-center">
        <Image
          src="https://res.cloudinary.com/thx8mokj/image/upload/v1786000872/dtm_size_guide_ygrem5.png"
          alt="Don't Tell Mama size guide"
          width={680}
          height={460}
          className="max-w-full px-4 sm:max-w-[700px]"
        />
      </div>

      {/* How to Measure */}
      <section className="mb-16 rounded-xl border border-olive/10 bg-ivory-cool p-8 sm:p-12">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-semibold text-olive-dark">How to Measure Yourself</h2>
        </div>
        <div className="space-y-4 text-stone-600">
          <p>
            For the best fit, use a soft measuring tape and take your measurements over light clothing. Keep the tape snug but not tight — you should be able to slide a finger underneath comfortably. Measure all areas in inches for the most accurate sizing.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-olive-dark">Bust</h3>
              <p className="mt-2 text-sm text-stone-600">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-olive-dark">Waist</h3>
              <p className="mt-2 text-sm text-stone-600">Measure around your natural waistline, the narrowest part of your torso.</p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-olive-dark">Hip</h3>
              <p className="mt-2 text-sm text-stone-600">Measure around the fullest part of your hips, about 8&quot; below your waist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Measurement Reference Table */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-semibold text-olive-dark">Size Reference</h2>
          <p className="mt-2 text-stone-600">Standard Indian women&apos;s ready-to-wear measurements in inches.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-olive/10">
          <table className="w-full border-collapse bg-ivory text-sm">
            <thead>
              <tr className="border-b-2 border-olive/20 bg-ivory-cool">
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-stone-700">Size</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-stone-700">Bust</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-stone-700">Waist</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-stone-700">Hip</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-olive/10">
                <td className="px-6 py-4 font-semibold text-olive">XS</td>
                <td className="px-6 py-4 text-stone-700">32&quot;</td>
                <td className="px-6 py-4 text-stone-700">26&quot;</td>
                <td className="px-6 py-4 text-stone-700">35&quot;</td>
              </tr>
              <tr className="border-b border-olive/10 bg-ivory-cool/50">
                <td className="px-6 py-4 font-semibold text-olive">S</td>
                <td className="px-6 py-4 text-stone-700">34&quot;</td>
                <td className="px-6 py-4 text-stone-700">28&quot;</td>
                <td className="px-6 py-4 text-stone-700">37&quot;</td>
              </tr>
              <tr className="border-b border-olive/10">
                <td className="px-6 py-4 font-semibold text-olive">M</td>
                <td className="px-6 py-4 text-stone-700">36&quot;</td>
                <td className="px-6 py-4 text-stone-700">30&quot;</td>
                <td className="px-6 py-4 text-stone-700">39&quot;</td>
              </tr>
              <tr className="border-b border-olive/10 bg-ivory-cool/50">
                <td className="px-6 py-4 font-semibold text-olive">L</td>
                <td className="px-6 py-4 text-stone-700">38&quot;</td>
                <td className="px-6 py-4 text-stone-700">32&quot;</td>
                <td className="px-6 py-4 text-stone-700">41&quot;</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-olive">XL</td>
                <td className="px-6 py-4 text-stone-700">40&quot;</td>
                <td className="px-6 py-4 text-stone-700">34&quot;</td>
                <td className="px-6 py-4 text-stone-700">43&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Garment Care */}
      <section className="mb-16 rounded-xl border border-olive/10 bg-ivory-warm p-8 sm:p-12">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-semibold text-olive-dark">Garment Care</h2>
          <p className="mt-2 text-stone-600">Proper care ensures your pieces stay beautiful for years to come.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-display text-xl font-semibold text-olive-dark">General Care</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Dry clean recommended for embellished pieces with beadwork or embroidery</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Hand wash cold in shade for non-embellished pieces</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Air dry in shade away from direct sunlight</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Store in a breathable garment bag to protect from dust and moisture</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-xl font-semibold text-olive-dark">Special Care</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Handle beadwork and embroidery gently to avoid snagging</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Avoid hanging heavy embellished pieces — fold and store flat</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Iron on low heat if needed, preferably on the reverse side</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Keep away from direct sunlight to prevent fading</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Custom Fit Note */}
      <section className="rounded-2xl border border-olive/10 bg-olive-dark p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-gold/20 p-3 text-gold">
            <Ruler size={28} />
          </div>
          <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">Made to Order</h2>
          <p className="mt-4 text-ivory/80">
            Since our pieces are made to order, you can share additional measurements or special requests at checkout using the &quot;Customize Your Fit&quot; option on any product page. We&apos;re happy to accommodate your unique requirements for the perfect fit.
          </p>
          <Link
            href="/shop/all"
            className="mt-8 inline-flex items-center gap-2 border border-gold px-8 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-olive-dark"
          >
            Shop the Collection <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  )
}