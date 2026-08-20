'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const orderId = params.id as string
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order)
        setStatus(data.order.status)
        setTrackingNumber(data.order.metadata?.tracking_number || '')
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [params.id, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const token = localStorage.getItem('admin_token')
    const orderId = params.id as string

    try {
      // Update status via admin API
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/admin/orders/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      // Update metadata (tracking number) via custom update
      // Note: Medusa admin API doesn't directly support metadata update via this endpoint.
      // We'll use the admin API to update the order's metadata.
      // Alternatively, we could use the `medusa` SDK admin client, but we'll use raw fetch.
      // Actually the admin order update endpoint does support metadata.
      // We'll combine both: update status and metadata in one call.
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/admin/orders/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          metadata: {
            tracking_number: trackingNumber,
          },
        }),
      })

      setMessage('Updated successfully!')
    } catch (err) {
      setMessage('Error updating order.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!order) return <div className="p-8 text-center">Order not found</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to orders
      </Link>
      <h1 className="text-2xl font-bold">Order #{order.display_id}</h1>
      <div className="bg-white p-6 rounded-lg shadow mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Customer:</strong> {order.email || 'N/A'}</p>
            <p><strong>Total:</strong> ₹{(order.total / 100).toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Shipping Address:</strong></p>
            {order.shipping_address ? (
              <p className="text-sm">
                {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                {order.shipping_address.address_1}<br />
                {order.shipping_address.city}, {order.shipping_address.postal_code}
              </p>
            ) : (
              <p>No address</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter tracking number"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span className={message.includes('Error') ? 'text-red-600' : 'text-green-600'}>{message}</span>}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <ul>
            {order.items?.map((item: any) => (
              <li key={item.id} className="flex justify-between py-1 text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{(item.unit_price / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
