import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const ordersRes = await pool.query(`
      SELECT o.id, o.display_id, o.email, o.status, o.currency_code, o.metadata, o.created_at,
             a.first_name, a.last_name, a.address_1, a.city, a.postal_code, a.phone, a.country_code
      FROM "order" o
      LEFT JOIN order_address a ON o.shipping_address_id = a.id
      WHERE o.deleted_at IS NULL
      ORDER BY o.created_at DESC
    `)

    const orders = ordersRes.rows
    const orderIds = orders.map((o) => o.id)

    const itemsByOrder: Record<string, { title: string; quantity: number; unit_price: number }[]> = {}
    if (orderIds.length > 0) {
      const itemsRes = await pool.query(
        `SELECT order_id, title, quantity, unit_price FROM order_line_item WHERE order_id = ANY($1)`,
        [orderIds]
      )
      for (const item of itemsRes.rows) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
        itemsByOrder[item.order_id].push(item)
      }
    }

    const result = orders.map((o) => {
      const items = itemsByOrder[o.id] || []
      const total = items.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0)
      return {
        id: o.id,
        display_id: o.display_id,
        email: o.email,
        status: o.status,
        tracking_number: o.metadata?.tracking_number || '',
        created_at: o.created_at,
        total,
        currency_code: o.currency_code,
        shipping_address: {
          name: `${o.first_name || ''} ${o.last_name || ''}`.trim(),
          address_1: o.address_1,
          city: o.city,
          postal_code: o.postal_code,
          phone: o.phone,
        },
        items,
      }
    })

    return NextResponse.json({ orders: result })
  } catch (e) {
    console.error('GET /api/orders error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { order_id, status, tracking_number } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    const existing = await pool.query(`SELECT metadata FROM "order" WHERE id = $1`, [order_id])
    const currentMetadata = existing.rows[0]?.metadata || {}
    const newMetadata = { ...currentMetadata, tracking_number: tracking_number ?? currentMetadata.tracking_number }

    await pool.query(
      `UPDATE "order" SET status = COALESCE($1, status), metadata = $2, updated_at = now() WHERE id = $3`,
      [status || null, JSON.stringify(newMetadata), order_id]
    )

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('POST /api/orders error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
