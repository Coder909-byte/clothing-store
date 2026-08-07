'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock } from 'lucide-react'
import { medusa } from '@/lib/medusa'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
    } = {}

    if (!firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
      // Step 1: Register auth identity
      const authResponse = await medusa.auth.register('customer', 'emailpass', {
        email,
        password,
      })

      // @ts-expect-error - Medusa SDK response types vary
      const token = authResponse?.token || authResponse

      if (!token) {
        setErrors({ general: 'Failed to create account. Please try again.' })
        return
      }

      // Step 2: Create customer record
      await medusa.store.customer.create({
        email,
        first_name: firstName,
        last_name: lastName,
      })

      // Step 3: Store token and redirect
      localStorage.setItem('dtm_auth_token', token as string)
      router.push('/account')
    } catch (error) {
      console.error('Registration error:', error)
      // Check if it's an email already exists error
      if (error instanceof Error && error.message.includes('already exists')) {
        setErrors({ general: 'Email already registered' })
      } else {
        setErrors({ general: 'Failed to create account. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-olive/10 bg-ivory-cool p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-olive-dark">Create Account</h1>
          <p className="mt-2 text-sm text-stone-500">Join the Don't Tell Mama community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name field */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-stone-700">
              First Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-stone-400" />
              </div>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full border rounded-md pl-10 pr-3 py-2.5 text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                  errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-olive'
                }`}
                placeholder="Jane"
              />
            </div>
            {errors.firstName && <p className="mt-1.5 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          {/* Last Name field */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-stone-700">
              Last Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-stone-400" />
              </div>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full border rounded-md pl-10 pr-3 py-2.5 text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
                  errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-olive'
                }`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && <p className="mt-1.5 text-sm text-red-600">{errors.lastName}</p>}
          </div>

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
            <p className="mt-1.5 text-xs text-stone-500">Must be at least 8 characters</p>
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Log in link */}
        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link href="/account/login" className="font-medium text-olive hover:text-gold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}