'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { medusa } from '@/lib/medusa'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await medusa.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Handle different response types from Medusa auth
      // @ts-expect-error - Medusa SDK response types vary
      const token = response?.token || response

      if (token) {
        localStorage.setItem('dtm_auth_token', token as string)
        router.push('/account')
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-olive/10 bg-ivory-cool p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-olive-dark">Log In</h1>
          <p className="mt-2 text-sm text-stone-500">Welcome back to Don't Tell Mama</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-stone-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md pl-10 pr-3 py-2.5 text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-olive'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-stone-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md pl-10 pr-3 py-2.5 text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-olive'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-olive px-4 py-3 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-olive-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-stone-600">
            Don't have an account?{' '}
          <Link href="/account/register" className="font-medium text-olive hover:text-gold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}