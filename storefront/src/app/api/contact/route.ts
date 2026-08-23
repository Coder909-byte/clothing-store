import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, topic, orderNumber, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL
    if (!ownerEmail) {
      console.error('Contact form error: OWNER_NOTIFICATION_EMAIL not set')
      return NextResponse.json({ error: 'Contact form is not configured' }, { status: 500 })
    }

    const escapeHtml = (s: string) =>
      String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

    const html = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px;">
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${topic ? `<p><strong>Topic:</strong> ${escapeHtml(topic)}</p>` : ''}
        ${orderNumber ? `<p><strong>Order Number:</strong> ${escapeHtml(orderNumber)}</p>` : ''}
        <h3>Message</h3>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [ownerEmail],
        reply_to: email,
        subject: `Contact form: ${topic || 'New message'} — ${name}`,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return NextResponse.json({ error: data.message || 'Failed to send message' }, { status: res.status })
    }

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    console.error('Contact form error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
