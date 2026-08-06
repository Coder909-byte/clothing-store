'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface Product {
  images?: Array<{ url: string }> | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
}

interface Props {
  product: Product
  title: string
}

export default function ProductGallery({ product, title }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  // Build image list: thumbnail + additional images
  const images = [
    product.thumbnail || product.images?.[0]?.url,
    ...(product.images?.slice(1, 3).map(img => img.url) || []),
  ].filter(Boolean) as string[]

  const videoUrl = product.metadata?.video_url as string | undefined
  const currentImage = images[selectedImageIndex] || images[0]

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
    setShowVideo(false)
  }

  const handleVideoToggle = () => {
    setShowVideo(!showVideo)
  }

  return (
    <div className="space-y-3">
      {/* Main display area */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ivory-cool">
        {showVideo && videoUrl ? (
          <>
            <video
              src={videoUrl}
              controls
              loop
              playsInline
              className="h-full w-full object-cover"
              autoPlay
            />
            <button
              onClick={handleVideoToggle}
              className="absolute top-4 right-4 rounded-full bg-ivory/90 p-2 text-stone-700 transition-all hover:bg-ivory hover:text-olive"
              aria-label="Show photos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </button>
          </>
        ) : (
          <>
            <Image
              src={currentImage}
              alt={`${title}${selectedImageIndex === 0 ? '' : ` — view ${selectedImageIndex + 1}`}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {videoUrl && (
              <button
                onClick={handleVideoToggle}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ivory/90 px-4 py-2 text-sm font-medium text-stone-700 transition-all hover:bg-ivory hover:text-olive"
                aria-label="Watch video"
              >
                <Play size={16} fill="currentColor" />
                Watch video
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-[4/5] overflow-hidden rounded-md transition-all ${
                selectedImageIndex === index && !showVideo
                  ? 'ring-2 ring-olive ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} — thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 33vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}