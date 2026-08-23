'use client'

import { useState } from 'react'

const TOPICS = [
  'Order inquiry',
  'Returns & exchanges',
  'Sizing help',
  'Press & partnerships',
  'Wholesale',
  'Other',
]

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, orderNumber, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')

      setStatus('sent')
      setName('')
      setEmail('')
      setTopic('')
      setOrderNumber('')
      setMessage('')
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-olive/10 bg-ivory-cool p-8">
      {status === 'sent' && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          Thanks — your message has been sent. We&apos;ll get back to you within 24 hours.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">{errorMessage}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Topic
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
        >
          <option value="">Select a topic…</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-order" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Order Number <span className="font-normal normal-case text-stone-400">(optional)</span>
        </label>
        <input
          id="contact-order"
          type="text"
          placeholder="DTM-XXXXXXXX"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-full rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-md border border-olive/20 bg-ivory px-4 py-2.5 text-sm focus:border-olive focus:outline-none"
          placeholder="Tell us what's on your mind…"
        />
      </div>

      <button
        id="contact-submit-btn"
        type="submit"
        disabled={sending}
        className="w-full rounded-md bg-olive py-3.5 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark active:scale-[0.99] disabled:opacity-50"
      >
        {sending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
