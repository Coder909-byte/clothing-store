'use client'

import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = 'khush@007'

interface Order {
  id: string
  display_id: number
  email: string
  status: string
  tracking_number: string
  created_at: string
  total: number
  currency_code: string
  shipping_address: { name: string; address_1: string; city: string; postal_code: string; phone: string }
  items: { title: string; quantity: number; unit_price: number }[]
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [edits, setEdits] = useState<Record<string, { status: string; tracking_number: string }>>({})

  useEffect(() => {
    if (sessionStorage.getItem('dtm_admin_authed') === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    if (authed) fetchOrders()
  }, [authed])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders || [])
      const initEdits: Record<string, { status: string; tracking_number: string }> = {}
      for (const o of data.orders || []) {
        initEdits[o.id] = { status: o.status, tracking_number: o.tracking_number || '' }
      }
      setEdits(initEdits)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('dtm_admin_authed', 'true')
      setAuthed(true)
    } else {
      alert('Wrong password')
    }
  }

  const handleSave = async (orderId: string) => {
    const edit = edits[orderId]
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: edit.status, tracking_number: edit.tracking_number }),
    })
    if (res.ok) {
      alert('Saved')
      fetchOrders()
    } else {
      alert('Failed to save')
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="mb-4 text-2xl font-semibold">Admin Login</h1>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="mb-3 w-full rounded-md border px-3 py-2"
          placeholder="Password"
        />
        <button onClick={handleLogin} className="w-full rounded-md bg-olive px-4 py-2 text-ivory">
          Log In
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Orders</h1>
      {loading && <p>Loading...</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">Order #{o.display_id}</span>
              <span>{new Date(o.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm">Email: {o.email}</p>
            <p className="text-sm">
              Ship to: {o.shipping_address.name}, {o.shipping_address.address_1}, {o.shipping_address.city} —{' '}
              {o.shipping_address.postal_code} | Phone: {o.shipping_address.phone}
            </p>
            <ul className="my-2 text-sm text-stone-600">
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.title} × {item.quantity} — ₹{item.unit_price}
                </li>
              ))}
            </ul>
            <p className="mb-3 text-sm font-semibold">Total: ₹{o.total.toLocaleString('en-IN')}</p>
            <div className="flex items-center gap-3">
              <select
                value={edits[o.id]?.status || o.status}
                onChange={(e) => setEdits({ ...edits, [o.id]: { ...edits[o.id], status: e.target.value } })}
                className="rounded-md border px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <input
                type="text"
                placeholder="Tracking number"
                value={edits[o.id]?.tracking_number || ''}
                onChange={(e) => setEdits({ ...edits, [o.id]: { ...edits[o.id], tracking_number: e.target.value } })}
                className="flex-1 rounded-md border px-2 py-1 text-sm"
              />
              <button onClick={() => handleSave(o.id)} className="rounded-md bg-olive px-4 py-1 text-sm text-ivory">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
