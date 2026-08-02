'use client'

import { useState } from 'react'
import { Ruler } from 'lucide-react'

interface CustomSizeFormProps {
  productId: string
  productTitle: string
}

interface SizeData {
  height: string
  heightUnit: 'cm' | 'inches'
  bust: string
  waist: string
  hip: string
  notes: string
}

export default function CustomSizeForm({ productId, productTitle }: CustomSizeFormProps) {
  const [sizeData, setSizeData] = useState<SizeData>({
    height: '',
    heightUnit: 'cm',
    bust: '',
    waist: '',
    hip: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!sizeData.height) {
      alert('Please enter your height')
      setIsSubmitting(false)
      return
    }

    const heightNum = parseFloat(sizeData.height)
    if (sizeData.heightUnit === 'cm' && (heightNum < 100 || heightNum > 250)) {
      alert('Height must be between 100-250 cm')
      setIsSubmitting(false)
      return
    }
    if (sizeData.heightUnit === 'inches' && (heightNum < 39 || heightNum > 94)) {
      alert('Height must be between 39-94 inches')
      setIsSubmitting(false)
      return
    }

    // Validate optional fields
    if (sizeData.bust) {
      const bust = parseFloat(sizeData.bust)
      if (sizeData.heightUnit === 'cm' && (bust < 60 || bust > 150)) {
        alert('Bust must be between 60-150 cm')
        setIsSubmitting(false)
        return
      }
      if (sizeData.heightUnit === 'inches' && (bust < 24 || bust > 59)) {
        alert('Bust must be between 24-59 inches')
        setIsSubmitting(false)
        return
      }
    }

    if (sizeData.waist) {
      const waist = parseFloat(sizeData.waist)
      if (sizeData.heightUnit === 'cm' && (waist < 50 || waist > 130)) {
        alert('Waist must be between 50-130 cm')
        setIsSubmitting(false)
        return
      }
      if (sizeData.heightUnit === 'inches' && (waist < 20 || waist > 51)) {
        alert('Waist must be between 20-51 inches')
        setIsSubmitting(false)
        return
      }
    }

    if (sizeData.hip) {
      const hip = parseFloat(sizeData.hip)
      if (sizeData.heightUnit === 'cm' && (hip < 60 || hip > 160)) {
        alert('Hip must be between 60-160 cm')
        setIsSubmitting(false)
        return
      }
      if (sizeData.heightUnit === 'inches' && (hip < 24 || hip > 63)) {
        alert('Hip must be between 24-63 inches')
        setIsSubmitting(false)
        return
      }
    }

    // TODO: Send to Medusa as line item metadata
    // This will be stored on the order line item when added to cart
    console.log('Custom size data:', {
      productId,
      productTitle,
      sizeData,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setSizeData({
        height: '',
        heightUnit: 'cm',
        bust: '',
        waist: '',
        hip: '',
        notes: '',
      })
    }, 3000)
  }

  const updateField = (field: keyof SizeData, value: string) => {
    setSizeData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-olive/10 p-4 text-center">
        <div className="mb-2 inline-flex rounded-full bg-olive/20 p-2 text-olive">
          <Ruler size={20} />
        </div>
        <p className="text-sm font-semibold text-olive">Custom fit preferences saved!</p>
        <p className="mt-1 text-xs text-stone-600">These will be applied to your order</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Height - Required */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-700">
          Height <span className="text-gold">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            required
            value={sizeData.height}
            onChange={(e) => updateField('height', e.target.value)}
            placeholder={sizeData.heightUnit === 'cm' ? 'e.g., 165' : 'e.g., 65'}
            className="flex-1 rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
          />
          <div className="flex rounded-md border border-olive/20 overflow-hidden">
            <button
              type="button"
              onClick={() => updateField('heightUnit', 'cm')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                sizeData.heightUnit === 'cm'
                  ? 'bg-olive text-ivory'
                  : 'bg-ivory text-stone-600 hover:bg-olive/10'
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => updateField('heightUnit', 'inches')}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                sizeData.heightUnit === 'inches'
                  ? 'bg-olive text-ivory'
                  : 'bg-ivory text-stone-600 hover:bg-olive/10'
              }`}
            >
              in
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-stone-500">
          {sizeData.heightUnit === 'cm' ? 'Range: 100-250 cm' : 'Range: 39-94 inches'}
        </p>
      </div>

      {/* Optional measurements */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Bust <span className="font-normal normal-case text-stone-400">(optional)</span>
          </label>
          <input
            type="number"
            value={sizeData.bust}
            onChange={(e) => updateField('bust', e.target.value)}
            placeholder={sizeData.heightUnit === 'cm' ? 'cm' : 'in'}
            className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Waist <span className="font-normal normal-case text-stone-400">(optional)</span>
          </label>
          <input
            type="number"
            value={sizeData.waist}
            onChange={(e) => updateField('waist', e.target.value)}
            placeholder={sizeData.heightUnit === 'cm' ? 'cm' : 'in'}
            className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Hip <span className="font-normal normal-case text-stone-400">(optional)</span>
          </label>
          <input
            type="number"
            value={sizeData.hip}
            onChange={(e) => updateField('hip', e.target.value)}
            placeholder={sizeData.heightUnit === 'cm' ? 'cm' : 'in'}
            className="w-full rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-700">
          Special Instructions <span className="font-normal normal-case text-stone-400">(optional)</span>
        </label>
        <textarea
          value={sizeData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          placeholder="Any specific fit preferences or alterations needed..."
          className="w-full resize-none rounded-md border border-olive/20 bg-ivory px-3 py-2 text-sm focus:border-olive focus:outline-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md border border-olive bg-olive px-4 py-2.5 text-sm font-semibold text-ivory transition-all hover:bg-olive-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Save Custom Fit'}
      </button>

      <p className="text-xs text-stone-500 text-center">
        Your measurements will be attached to this order for our tailoring team
      </p>
    </form>
  )
}