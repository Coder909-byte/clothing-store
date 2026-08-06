import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: "Don't Tell Mama refund policy — easy returns within 30 days.",
}

// TODO: Legal text needs final client/lawyer review before launch.
const REFUND_POLICY = `
**Last updated: January 2025**

## Exchange Policy

Since garments are made to order, we don't offer exchanges. One free alteration is included per order; the customer covers any shipping costs related to the alteration. Custom or made-to-measure orders are not eligible for exchange.

## Return Policy

All sales are final. We don't offer returns or refunds on any order. We recommend reviewing your order carefully, including size and customization details, before completing your purchase.

## Damages and Issues

Please record a video while unboxing your package. If an item arrives damaged, defective, or incorrect, contact our support team immediately with the video and your order number so we can help resolve it.

## Exceptions / Non-Returnable Items

Sale or discounted items are not eligible for return under any circumstance.

## Contact Us

For any questions or concerns, please reach out to us at **support@donttellmama.com**.
`.trim()

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">Refund Policy</h1>
      <div
        className="prose prose-stone prose-headings:font-display prose-headings:text-olive-dark prose-a:text-olive prose-strong:text-stone-800 max-w-none"
        dangerouslySetInnerHTML={{ __html: REFUND_POLICY.replace(/\n/g, '<br />').replace(/## (.+)/g, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  )
}