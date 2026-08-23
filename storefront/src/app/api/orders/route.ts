import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const ordersRes = await pool.query(`
      SELECT o.id, o.display_id, o.email, o.status, o.currency_code, o.metadata, o.created_at,
             a.first_name, a.last_name, a.address_1, a.address_2, a.city, a.province, a.postal_code, a.phone, a.country_code,
             c.first_name AS customer_first_name, c.last_name AS customer_last_name, c.phone AS customer_phone,
             os.totals ->> 'current_order_total' AS order_total
      FROM "order" o
      LEFT JOIN order_address a ON o.shipping_address_id = a.id
      LEFT JOIN customer c ON o.customer_id = c.id
      LEFT JOIN order_summary os ON os.order_id = o.id
      WHERE o.deleted_at IS NULL
      ORDER BY o.created_at DESC
    `)

    const orders = ordersRes.rows
    const orderIds = orders.map((o) => o.id)

    // order_line_item holds each item's details (title, price, variant, custom-fit
    // metadata); order_item is the per-order join table that carries the quantity.
    // There is no order_id/quantity column directly on order_line_item.
    const itemsByOrder: Record<
      string,
      { title: string; quantity: number; unit_price: number; variant_title: string | null; metadata: Record<string, unknown> | null }[]
    > = {}
    if (orderIds.length > 0) {
      const itemsRes = await pool.query(
        `SELECT oi.order_id, oli.title, oi.quantity, oli.unit_price, oli.variant_title, oli.metadata
         FROM order_item oi
         JOIN order_line_item oli ON oli.id = oi.item_id
         WHERE oi.order_id = ANY($1)`,
        [orderIds]
      )
      for (const item of itemsRes.rows) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
        itemsByOrder[item.order_id].push(item)
      }
    }

    const result = orders.map((o) => {
      const items = itemsByOrder[o.id] || []
      const customerName =
        `${o.customer_first_name || o.first_name || ''} ${o.customer_last_name || o.last_name || ''}`.trim()
      return {
        id: o.id,
        display_id: o.display_id,
        email: o.email,
        status: o.status,
        tracking_number: o.metadata?.tracking_number || '',
        created_at: o.created_at,
        total: o.order_total !== null ? Number(o.order_total) : 0,
        currency_code: o.currency_code,
        customer: {
          name: customerName,
          phone: o.customer_phone || o.phone || '',
        },
        shipping_address: {
          name: customerName,
          address_1: o.address_1,
          address_2: o.address_2,
          city: o.city,
          province: o.province,
          postal_code: o.postal_code,
          phone: o.phone,
          country_code: o.country_code,
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
