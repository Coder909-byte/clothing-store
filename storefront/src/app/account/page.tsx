import type { Metadata } from 'next'
import Link from 'next/link'
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your orders, addresses, and account details.',
}

// UI skeleton — Medusa JWT auth to be wired in Phase 2
const IS_LOGGED_IN = false

function LoginForm() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-olive/10 bg-ivory-cool p-8">
        <h2 className="font-display mb-1 text-2xl font-semibold text-olive-dark">Welcome back</h2>
        <p className="mb-6 text-sm text-stone-500">Sign in to your Don&apos;t Tell Mama account</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">Email</label>
            <input id="login-email" type="email" placeholder="you@example.com" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-stone-500">Password</label>
              <button className="text-xs text-olive hover:underline">Forgot password?</button>
            </div>
            <input id="login-password" type="password" className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none" />
          </div>
          <button
            id="login-btn"
            className="w-full rounded-md bg-olive py-3 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark active:scale-[0.99]"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            New here?{' '}
            <button className="font-semibold text-olive hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    </div>
  )
}

function AccountDashboard() {
  const ACCOUNT_LINKS = [
    { icon: Package, label: 'My Orders', href: '/account/orders', description: 'View and track your orders' },
    { icon: MapPin, label: 'Addresses', href: '/account/addresses', description: 'Manage shipping addresses' },
    { icon: User, label: 'Profile', href: '/account/profile', description: 'Update your personal details' },
  ]

  return (
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

      <button className="group flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-6 text-left transition-all hover:border-red-200">
        <div className="rounded-lg bg-red-100 p-3 text-red-500">
          <LogOut size={20} />
        </div>
        <div>
          <h3 className="font-medium text-red-600">Sign Out</h3>
          <p className="mt-1 text-sm text-red-400">End your current session</p>
        </div>
      </button>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-semibold text-olive-dark">My Account</h1>
      {IS_LOGGED_IN ? <AccountDashboard /> : <LoginForm />}
    </div>
  )
}
