import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { order, customer } = await request.json()

    if (!order || !customer || !customer.email) {
      return NextResponse.json(
        { error: 'Missing order or customer email' },
        { status: 400 }
      )
    }

    // Build the email HTML
    const items = order.items?.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_title || item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.unit_price / 100).toFixed(2)}</td>
      </tr>
    `).join('') || ''

    const total = order.total / 100

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #6B7A4A; }
          .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #6B7A4A; color: white; padding: 10px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Thank you for your order, ${customer.first_name}!</h1>
        <p>Your order has been confirmed and is being prepared for shipping.</p>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> #${order.display_id || order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
        </div>

        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>

        <div class="total">
          <p>Total: ₹${total.toFixed(2)}</p>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have any questions, please contact us at support.donttellmama@gmail.com
        </p>
      </body>
      </html>
    `

    // Send email using Resend API directly
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [customer.email],
        subject: `Order Confirmation #${order.display_id || order.id}`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return NextResponse.json({ error: data.message || 'Email send failed' }, { status: res.status })
    }

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    console.error('Email error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}