import { type SubscriberConfig } from "@medusajs/medusa"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Resend } from "resend"

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: any) {
  console.log(`[order-placed] Processing order: ${data.id}`)

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.warn("[order-placed] No RESEND_API_KEY found, skipping email.")
    return
  }

  // Note: this is NOT "orderModuleService" — that key doesn't exist in the
  // container. Cross-module data (customer, shipping address, line items)
  // is fetched via the Query module instead of the raw Order module service.
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "summary.current_order_total",
        "customer.first_name",
        "customer.last_name",
        "customer.email",
        "customer.phone",
        "shipping_address.*",
        "items.title",
        "items.quantity",
        "items.unit_price",
        "items.variant_title",
        "items.metadata",
      ],
      filters: { id: data.id },
    })

    const order = orders?.[0] as any
    if (!order) {
      console.warn(`[order-placed] Order ${data.id} not found`)
      return
    }

    const email = order.email || order.customer?.email
    if (!email) {
      console.warn(`[order-placed] No email found for order ${data.id}`)
      return
    }

    const customerName =
      [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(" ").trim() || "there"
    const phone = order.customer?.phone || order.shipping_address?.phone || "—"
    const addr = order.shipping_address
    const addressLines: string[] = addr
      ? [
          addr.address_1,
          addr.address_2,
          [addr.city, addr.province].filter(Boolean).join(", "),
          addr.postal_code,
          addr.country_code?.toUpperCase(),
        ].filter(Boolean)
      : []

    const items = order.items || []
    const itemsHtml = items
      .map((item: any) => {
        const fitEntries = Object.entries(item.metadata || {}).filter(
          ([, v]) => v !== undefined && v !== null && v !== ""
        )
        const fitHtml = fitEntries.length
          ? `<div style="margin-top:4px;font-size:13px;color:#666;">
              ${fitEntries
                .map(([k, v]) => `<div><strong>${k.replace(/_/g, " ")}:</strong> ${v}</div>`)
                .join("")}
            </div>`
          : ""
        return `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">
              <div>${item.title}${item.variant_title ? ` — ${item.variant_title}` : ""}</div>
              ${fitHtml}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatINR(item.unit_price)}</td>
          </tr>
        `
      })
      .join("")

    const total = order.summary?.current_order_total ?? 0

    const resend = new Resend(resendApiKey)
    const { data: resendData, error } = await resend.emails.send({
      // Sandbox sender — works without a verified domain. Switch to a verified
      // "Don't Tell Mama <orders@donttellmama.com>" once that domain is
      // verified in the Resend dashboard.
      from: "Don't Tell Mama <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmation - #${order.display_id || order.id}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>We've received your order <strong>#${order.display_id || order.id}</strong>.</p>

          <h3 style="margin-bottom:4px;">Shipping to</h3>
          <p style="margin-top:0;">
            ${customerName}<br/>
            ${addressLines.join("<br/>")}<br/>
            Phone: ${phone}<br/>
            Email: ${email}
          </p>

          <h3 style="margin-bottom:4px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left;border-bottom:2px solid #333;padding-bottom:6px;">Item</th>
                <th style="text-align:center;border-bottom:2px solid #333;padding-bottom:6px;">Qty</th>
                <th style="text-align:right;border-bottom:2px solid #333;padding-bottom:6px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p style="text-align:right;font-size:16px;margin-top:12px;">
            <strong>Total: ${formatINR(total)}</strong>
          </p>

          <p>We will notify you once it ships.</p>
          <br />
          <p>Best regards,</p>
          <p>Don't Tell Mama Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("[order-placed] Resend API error:", error)
    } else {
      console.log("[order-placed] Order confirmation sent:", resendData?.id)
    }
  } catch (err) {
    console.error("[order-placed] Error sending email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
