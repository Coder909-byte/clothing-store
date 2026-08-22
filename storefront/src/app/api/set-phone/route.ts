import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { cart_id, phone } = await req.json()
    if (!cart_id || !phone) return NextResponse.json({ error: 'cart_id and phone required' }, { status: 400 })

    const cartRes = await pool.query(`SELECT customer_id FROM cart WHERE id = $1`, [cart_id])
    const customerId = cartRes.rows[0]?.customer_id

    if (customerId) {
      await pool.query(`UPDATE customer SET phone = $1, updated_at = now() WHERE id = $2`, [phone, customerId])
    }

    await pool.query(
      `UPDATE order_address SET phone = $1 WHERE id = (SELECT shipping_address_id FROM cart WHERE id = $2)`,
      [phone, cart_id]
    )

    return NextResponse.json({ success: true, customerId })
  } catch (e) {
    console.error('set-phone error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
