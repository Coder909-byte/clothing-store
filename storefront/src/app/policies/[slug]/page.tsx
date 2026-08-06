import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const POLICIES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
**Last updated: January 2025**

At Don't Tell Mama, your privacy matters as much as your style. This Privacy Policy explains how we collect, use, and protect your personal information.

## Information We Collect

- **Account Information**: Name, email address, and password when you create an account.
- **Order Information**: Shipping address, billing address, and payment details (processed securely via Razorpay — we never store card numbers).
- **Usage Data**: Pages visited, products viewed, and browsing patterns to improve your experience.

## How We Use Your Information

We use your information to process orders, send shipping updates, personalise your shopping experience, and improve our products and services. We do not sell your data to third parties.

## Cookies

We use essential cookies for cart functionality and optional analytics cookies (which you can decline). See our Cookie Policy for details.

## Contact

For privacy-related queries, email us at **privacy@donttellmama.in**.
    `.trim(),
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: `
**Last updated: January 2025**

By accessing Don't Tell Mama's website and placing orders, you agree to these Terms of Service.

## Orders & Payment

All prices are in Indian Rupees (INR) inclusive of applicable taxes. We reserve the right to cancel orders in case of pricing errors or stock discrepancies.

## Returns & Exchanges

Items may be returned within 30 days of delivery in original, unworn condition. Sale items are final. See our Shipping & Returns policy for full details.

## Intellectual Property

All content — photographs, copy, brand assets — is the exclusive property of Don't Tell Mama and may not be reproduced without written permission.

## Governing Law

These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
    `.trim(),
  },
  'shipping-and-returns': {
    title: 'Shipping & Returns',
    content: `
**Shipping ₹99 on all orders.**

## Shipping

- **Standard Delivery**: 5–7 business days — ₹99 on all orders.
- **Express Delivery**: 2–3 business days — ₹199.
- We ship across India via trusted courier partners.

## Returns

We accept returns within **30 days** of delivery. Items must be unworn, unwashed, and in original packaging.

To initiate a return, email **returns@donttellmama.in** with your order number and reason.

Refunds are processed within 5–7 business days of receiving the returned item.

## Exchanges

We offer free size exchanges on clothing. Contact us at the address above and we'll arrange a pickup.
    `.trim(),
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const policy = POLICIES[slug]
  if (!policy) return { title: 'Policy Not Found' }
  return {
    title: policy.title,
    description: `Don't Tell Mama — ${policy.title}`,
  }
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }))
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params
  const policy = POLICIES[slug]
  if (!policy) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">{policy.title}</h1>
      <div
        className="prose prose-stone prose-headings:font-display prose-headings:text-olive-dark prose-a:text-olive prose-strong:text-stone-800 max-w-none"
        dangerouslySetInnerHTML={{ __html: policy.content.replace(/\n/g, '<br />').replace(/## (.+)/g, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  )
}
