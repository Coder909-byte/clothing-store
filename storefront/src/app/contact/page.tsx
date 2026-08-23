import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with Don't Tell Mama — we'd love to hear from you.",
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support.donttellmama@gmail.com',
    href: 'mailto:support.donttellmama@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: 'Panipat, Haryana, India',
    href: null,
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours on business days',
    href: null,
  },
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
        <div className="lg:col-span-3">
          <ContactForm />
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
        </div>
      </div>
    </div>
  )
}
