/**
 * Cloudinary named-slot registry for Don't Tell Mama
 *
 * Every image/video reference in the storefront goes through this map.
 * Slot names (e.g. "home.hero.video") are the Cloudinary public IDs you'll
 * upload assets to. The `fallback` URL renders immediately with no Cloudinary
 * credentials, so the site works out of the box during development.
 *
 * Usage:
 *   import { MEDIA } from '@/lib/cloudinary'
 *   <video src={MEDIA.home.hero.fallbackVideoUrl} />
 *   // or with next-cloudinary once real assets are uploaded:
 *   <CldVideoPlayer publicId={MEDIA.home.hero.publicId} />
 */

// ─── Pexels free-to-embed video (no account needed) ──────────────────────────
const PEXELS_HERO_VIDEO =
  'https://player.vimeo.com/external/368763065.sd.mp4?s=9a3d9a27c2a0c7e1a0a0b0c0d0e0f000&profile_id=164&oauth2_token_id=57447761'

// ─── Placeholder image helper ─────────────────────────────────────────────────
const ph = (w: number, h: number, label: string, bg = '6B7A4A', fg = 'F5F0E8') =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}`

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const MEDIA = {
  home: {
    hero: {
      publicId: 'dont-tell-mama/home/hero-video',
      fallbackVideoUrl: PEXELS_HERO_VIDEO,
      fallbackPosterUrl: ph(1920, 1080, '', '3D4A2A', 'F5F0E8'),
    },
    lookbook: {
      publicIds: [
        'dont-tell-mama/home/lookbook-01',
        'dont-tell-mama/home/lookbook-02',
        'dont-tell-mama/home/lookbook-03',
      ],
      fallbacks: [
        ph(800, 1000, 'Lookbook 01'),
        ph(800, 1000, 'Lookbook 02'),
        ph(800, 1000, 'Lookbook 03'),
      ],
    },
    featuredBanner: {
      publicId: 'dont-tell-mama/home/featured-banner',
      fallback: ph(1200, 600, 'New Collection', 'C9A84C', '1a1a1a'),
    },
  },

  categories: {
    clothing: {
      publicId: 'dont-tell-mama/categories/clothing',
      fallback: ph(600, 800, 'Clothing'),
    },
    accessories: {
      publicId: 'dont-tell-mama/categories/accessories',
      fallback: ph(600, 800, 'Accessories'),
    },
    home: {
      publicId: 'dont-tell-mama/categories/home',
      fallback: ph(600, 800, 'Home'),
    },
  },

  product: (slug: string) => ({
    images: Array.from({ length: 4 }, (_, i) => ({
      publicId: `dont-tell-mama/products/${slug}/image-0${i + 1}`,
      fallback: ph(800, 1000, `${slug} — ${i + 1}`),
    })),
    thumbnail: {
      publicId: `dont-tell-mama/products/${slug}/thumbnail`,
      fallback: ph(400, 500, slug),
    },
  }),

  about: {
    brand: {
      publicId: 'dont-tell-mama/about/brand',
      fallback: ph(1000, 700, "Our Story", '3D4A2A', 'F5F0E8'),
    },
    team: Array.from({ length: 3 }, (_, i) => ({
      publicId: `dont-tell-mama/about/team-0${i + 1}`,
      fallback: ph(400, 500, `Team Member ${i + 1}`, 'C9A84C', '1a1a1a'),
    })),
  },
} as const

export type MediaRegistry = typeof MEDIA
