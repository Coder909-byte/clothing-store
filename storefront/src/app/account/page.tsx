'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react'

interface Customer {
  first_name?: string | null
  last_name?: string | null
  email: string
}

function AccountDashboard({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const ACCOUNT_LINKS = [
    { icon: Package, label: 'My Orders', href: '/account/orders', description: 'View and track your orders' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', description: 'Manage shipping addresses' },
    { icon: User, label: 'Profile', href: '/account/profile', description: 'Update your personal details' },
  ]

  return (
    <>
      <p className="mb-6 text-stone-600">
        Welcome back, {customer.first_name || customer.email}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ACCOUNT_LINKS.map(({ icon: Icon, label, href, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-olive/10 bg-ivory-cool p-6 transition-all hover:border-olive/30 hover:shadow-card"
          >
            <div className="rounded-lg bg-olive/10 p-3 text-olive transition-colors group-hover:bg-olive group-hover:text-ivory">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-stone-800">{label}</h3>
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            </div>
            <ChevronRight size={16} className="mt-1 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-olive" />
          </Link>
        ))}

        <button
          onClick={onLogout}
          className="group flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-6 text-left transition-all hover:border-red-200"
        >
          <div className="rounded-lg bg-red-100 p-3 text-red-500">
            <LogOut size={20} />
          </div>
          <div>
            <h3 className="font-medium text-red-600">Sign Out</h3>
            <p className="mt-1 text-sm text-red-400">End your current session</p>
          </div>
        </button>
      </div>
    </>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('dtm_auth_token')
    if (!token) {
      router.push('/account/login')
      return
    }

    const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL ?? 'http://localhost:9000'
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''

    fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid session')
        return res.json()
      })
      .then((data) => {
        setCustomer(data.customer)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('dtm_auth_token')
        router.push('/account/login')
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('dtm_auth_token')
    router.push('/account/login')
  }

  if (loading || !customer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-stone-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">My Account</h1>
      <AccountDashboard customer={customer} onLogout={handleLogout} />
    </div>
  )
}
