import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Don't Tell Mama — we'd love to hear from you.",
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@donttellmama.in',
    href: 'mailto:hello@donttellmama.in',
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: 'Mumbai, Maharashtra, India',
    href: null,
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours on business days',
    href: null,
  },
]

const TOPICS = [
  'Order inquiry',
  'Returns & exchanges',
  'Sizing help',
  'Press & partnerships',
  'Wholesale',
  'Other',
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Get in Touch</p>
        <h1 className="font-display text-4xl font-semibold text-olive-dark sm:text-5xl">
          We&apos;d Love to Hear From You
        </h1>
        <p className="mt-4 text-stone-500">
          A real person reads every message. We&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Contact form */}
        <div className="lg:col-span-3">
          <form className="space-y-5 rounded-xl border border-olive/10 bg-ivory-cool p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Topic
              </label>
              <select
                id="contact-topic"
                className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
              >
                <option value="">Select a topic…</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-order" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Order Number <span className="font-normal normal-case text-stone-400">(optional)</span>
              </label>
              <input
                id="contact-order"
                type="text"
                placeholder="DTM-XXXXXXXX"
                className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                className="w-full resize-none rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
                placeholder="Tell us what's on your mind…"
              />
            </div>

            <button
              id="contact-submit-btn"
              type="submit"
              className="w-full rounded-md bg-olive py-3.5 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark active:scale-[0.99]"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-2 lg:pt-8">
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="rounded-lg bg-olive/10 p-3 text-olive">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{label}</p>
                {href ? (
                  <a href={href} className="mt-0.5 text-sm text-stone-700 hover:text-olive">
                    {value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm text-stone-700">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Resend-powered note */}
          <div className="mt-4 rounded-lg border border-olive/10 bg-olive/5 p-4">
            <p className="text-xs text-stone-500">
              📬 Contact form emails are sent via{' '}
              <span className="font-semibold text-olive">Resend</span>.
              Configure <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">RESEND_API_KEY</code>{' '}
              in your environment to enable email delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
