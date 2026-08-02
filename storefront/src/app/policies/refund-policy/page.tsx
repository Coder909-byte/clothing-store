import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: "Don't Tell Mama refund policy — easy returns within 30 days.",
}

// TODO: Legal text needs final client/lawyer review before launch.
const REFUND_POLICY = `
**Last updated: January 2025**

At Don't Tell Mama, we want you to love every piece you order. If something doesn't feel right, we make returns simple.

## Return Window

We accept returns within **30 days** of delivery. Items must be:
- Unworn and unwashed
- In original packaging with all tags attached
- Free from signs of wear, alterations, or damage

## How to Initiate a Return

1. Email us at **returns@donttellmama.in** with your order number and reason for return
2. We'll review and send you a prepaid return label within 24 hours
3. Pack the item securely in its original packaging
4. Drop off at the nearest courier location

## Refund Timeline

Once we receive and inspect your return (2-3 business days), we'll process your refund:
- **5-7 business days** to reflect in your original payment method
- You'll receive email confirmation when the refund is initiated

## Refund Amount

- Full refund of the product price and any applicable taxes
- Original shipping charges are non-refundable (unless the return is due to our error)
- Return shipping is free for all domestic orders

## Exchanges

We offer **free size exchanges** on clothing items. Contact us at **returns@donttellmama.in** and we'll arrange a pickup of the original item and delivery of the new size.

## Non-Returnable Items

- Sale items marked as "final sale"
- Custom-sized garments (unless there's a manufacturing defect)
- Items returned after 30 days
- Products showing signs of wear, washing, or alteration

## Damaged or Defective Items

If you receive a damaged or defective product, please contact us within **48 hours** of delivery with photos. We'll arrange a replacement or full refund at no cost to you.

## Contact for Returns

**Email:** returns@donttellmama.in  
**Phone:** +91-XXXX-XXXXXX  
**Address:** Don't Tell Mama Returns, Mumbai, Maharashtra, India
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