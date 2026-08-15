import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa"
import { Resend } from "resend"

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

  // Get the order service/module
  // In v2, you can resolve modules from the container
  const orderService = container.resolve("orderModuleService") as any
  if (!orderService) {
      console.warn("[order-placed] Could not resolve orderModuleService.")
      return
  }

  try {
    const order = await orderService.retrieveOrder(data.id)
    if (!order) return

    const email = order.email
    if (!email) {
      console.warn(`[order-placed] No email found for order ${data.id}`)
      return
    }

    const resend = new Resend(resendApiKey)
    const { data: resendData, error } = await resend.emails.send({
      from: "Don't Tell Mama <orders@donttellmama.com>", // Make sure domain is verified in Resend
      to: [email],
      subject: `Order Confirmation - ${order.display_id || order.id}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Thank you for your order!</h2>
          <p>We've received your order <strong>#${order.display_id || order.id}</strong>.</p>
          <p>Total: <strong>${order.total / 100} INR</strong> (approx)</p>
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
