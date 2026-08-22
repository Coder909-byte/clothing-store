import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'dtm_user',
  password: 'dtm_password',
  database: 'dont_tell_mama',
})

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, phone, cartId } = await request.json()

    if (!email || !cartId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      // Check if customer already exists
      const existing = await client.query(
        'SELECT id FROM customer WHERE email = $1',
        [email]
      )

      let customerId: string

      if (existing.rows.length > 0) {
        customerId = existing.rows[0].id
        // Update phone if changed
        await client.query(
          'UPDATE customer SET phone = $1, updated_at = now() WHERE id = $2',
          [phone, customerId]
        )
      } else {
        // Insert new customer
        const insertResult = await client.query(
          `INSERT INTO customer (id, email, first_name, last_name, phone, created_at, updated_at)
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, now(), now())
           RETURNING id`,
          [email, firstName, lastName, phone]
        )
        customerId = insertResult.rows[0].id
      }

      // Link customer to the cart
      await client.query(
        'UPDATE cart SET customer_id = $1 WHERE id = $2',
        [customerId, cartId]
      )

      return NextResponse.json({ success: true, customerId })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Failed to create or link customer' },
      { status: 500 }
    )
  }
}