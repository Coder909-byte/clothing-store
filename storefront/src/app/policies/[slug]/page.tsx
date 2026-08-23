import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const POLICIES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `


At Don't Tell Mama, we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you shop with us.

## Information We Collect

When you place an order or create an account, we collect the following personal information:

- **Name** — for order processing and delivery
- **Email address** — for order confirmations, shipping updates, and customer support
- **Phone number** — for delivery coordination and order-related communication
- **Shipping address** — to deliver your order
- **Payment details** — processed securely through Razorpay (we do not store card numbers or payment information on our servers)

## How We Use Your Information

We use your personal data for the following purposes:

- Processing and fulfilling your orders
- Arranging shipping and delivery of your purchases
- Providing customer support and responding to your queries
- Sending order-related communications (confirmations, shipping updates, delivery notifications)
- Improving our products, services, and shopping experience

## Data Security

We implement appropriate security measures to protect your personal information from unauthorised access, alteration, or disclosure.

## Third-Party Sharing

We do not sell, trade, or rent your personal information to third parties. Your data is shared only with essential service providers (courier partners, payment processors) necessary to complete your order.

## Your Rights

You have the right to access, correct, or request deletion of your personal data. For any privacy-related concerns or requests, please contact us.

## Contact Us

For questions or concerns about this Privacy Policy, please reach out to us at **privacy@dontsellmama.com**.
    `.trim(),
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: `


By accessing and using the Don't Tell Mama website, you agree to be bound by these Terms of Service. Please read them carefully before placing an order.

## Acceptance of Terms

Your use of this website constitutes acceptance of these Terms of Service. If you do not agree with any part of these terms, please do not use our site or place orders.

## Made-to-Order Policy

All products on Don't Tell Mama are made to order. Each piece is crafted specifically for you upon order placement. Please review your order details, including size and customisation options, carefully before completing your purchase. All sales are final as per our Refund Policy.

## Intellectual Property

All content on this website — including photographs, product images, copy, designs, logos, and brand assets — is the exclusive property of Don't Tell Mama and is protected by copyright and trademark laws. No content may be reproduced, distributed, or used without our prior written permission.

## Orders & Pricing

- All prices are in Indian Rupees (INR) inclusive of applicable taxes
- We reserve the right to cancel orders in case of pricing errors, stock discrepancies, or suspected fraud
- Product availability is subject to change without notice

## Limitation of Liability

Don't Tell Mama shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.

## Governing Law

These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.

## Changes to Terms

We reserve the right to update these terms at any time. Continued use of the website following any changes constitutes acceptance of the updated terms.
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

## Returns & Exchanges

No returns or exchanges are accepted, except for damaged items. Please record the entire unboxing video and email it to us with your concern within 24 hours. An unboxing video is mandatory for any damage-related claim.
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
