import type { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder image helper — uses placehold.co with our brand colors
// ─────────────────────────────────────────────────────────────────────────────
const placeholder = (w: number, h: number, label: string) =>
  `https://placehold.co/${w}x${h}/6B7A4A/F5F0E8?text=${encodeURIComponent(label)}`

// ─────────────────────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Clothing', handle: 'clothing', description: "Timeless pieces for the modern woman." },
  { name: 'Accessories', handle: 'accessories', description: "Finishing touches that tell your story." },
  { name: 'Home', handle: 'home', description: "Objects with a quiet, confident presence." },
]

const PRODUCTS_BY_CATEGORY: Record<string, { title: string; description: string; price: number; imageUrl?: string }[]> = {
  clothing: [
    { title: 'The Linen Tunic', description: 'Relaxed silhouette in pure linen.', price: 4200 },
    { title: 'Wide-Leg Trousers', description: 'Vintage-inspired high-waist trousers.', price: 3800 },
    { title: 'Wrap Midi Dress', description: 'Adjustable wrap in botanical-print silk.', price: 5600 },
    { title: 'Oversized Blazer', description: 'Unstructured wool-blend blazer.', price: 6900 },
    { title: 'Crop Camisole', description: 'Delicate jacquard camisole.', price: 1800 },
  ],
  accessories: [
    { title: 'Woven Raffia Tote', description: 'Hand-woven artisan tote bag.', price: 2400 },
    { title: 'Silk Scarf 90cm', description: 'Digital-print silk twill square.', price: 1600 },
    { title: 'Leather Belt', description: 'Vegetable-tanned full-grain leather.', price: 1900 },
    { title: 'Pearl Drop Earrings', description: 'Freshwater pearl on gold vermeil.', price: 2200 },
    { title: 'Embroidered Mules', description: 'Kantha-stitch embroidered slip-ons.', price: 3100 },
  ],
  home: [
    { title: 'Ceramic Bud Vase', description: 'Handthrown stoneware, matte glaze.', price: 1400 },
    { title: 'Beeswax Pillar Candle', description: 'Unscented, 40-hour burn time.', price: 890 },
    { title: 'Linen Cushion Cover', description: 'European flax, natural dye.', price: 1200 },
    { title: 'Block-Print Table Runner', description: 'Hand block-printed on cotton.', price: 950 },
    { title: 'Brass Oil Diffuser', description: 'Traditional wick diffuser in brass.', price: 2600 },
  ],
}

// Featured products for homepage
const FEATURED_PRODUCTS = [
  { handle: 'product-1', title: 'Golden Haze', description: 'A beautifully crafted piece.', price: 13999, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg' },
  { handle: 'product-2', title: 'Celestial Maze', description: 'A beautifully crafted piece.', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751684/ac0c006f-f437-4853-bcda-b35984240d33_mmioak.jpg' },
  { handle: 'product-3', title: 'Ivory Dust', description: 'A beautifully crafted piece.', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751734/c1a2255a-0677-4108-8189-153ed282a41d_mzgqgp.jpg' },
  { handle: 'product-4', title: 'Cocoa Dusk', description: 'A beautifully crafted piece.', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751819/ace583f9-f928-403c-af7c-d213621a8dda_bcf540.jpg' },
  { handle: 'product-5', title: 'Moonveil', description: 'A beautifully crafted piece.', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785752903/1864aca2-2ffd-4acc-aaaf-01bb5e1cfc41_xxbvtt.jpg' },
]

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const regionModuleService = container.resolve(Modules.REGION)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const pricingModuleService = container.resolve(Modules.PRICING)
  const inventoryModuleService = container.resolve(Modules.INVENTORY)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)

  logger.info('🌱 Seeding Don\'t Tell Mama store…')

  // ── 1. Sales Channel ──────────────────────────────────────────────────────
  logger.info('Creating default sales channel…')
  const [salesChannel] = await salesChannelModuleService.createSalesChannels([
    { name: "Don't Tell Mama Web Store", description: 'Primary web storefront', is_disabled: false },
  ])

  // ── 2. Region ─────────────────────────────────────────────────────────────
  logger.info('Creating India region…')
  const [region] = await regionModuleService.createRegions([
    {
      name: 'India',
      currency_code: 'inr',
      countries: ['in'],
    },
  ])

  // ── 3. Stock Location ─────────────────────────────────────────────────────
  logger.info('Creating warehouse…')
  const [stockLocation] = await stockLocationModuleService.createStockLocations([
    { name: 'Main Warehouse', address: { address_1: 'Warehouse 1', city: 'Mumbai', country_code: 'in' } },
  ])

  // ── 4. Fulfillment Provider + Shipping Option ─────────────────────────────
  logger.info('Creating fulfillment set…')
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets([
    {
      name: 'Standard Shipping',
      type: 'shipping',
      service_zones: [
        {
          name: 'India',
          geo_zones: [{ type: 'country', country_code: 'in' }],
        },
      ],
    },
  ])

  // ── 5. Product Categories ─────────────────────────────────────────────────
  logger.info('Creating product categories…')
  const createdCategories = await productModuleService.createProductCategories(
    CATEGORIES.map((c) => ({ name: c.name, handle: c.handle, description: c.description, is_active: true }))
  )

  const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.handle, c.id]))

  // ── 6. Products ───────────────────────────────────────────────────────────
  logger.info('Creating products…')
  for (const [handle, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    for (const product of products) {
      const slug = product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      await productModuleService.createProducts([
        {
          title: product.title,
          handle: slug,
          description: product.description,
          status: 'published' as any,
          category_ids: [categoryMap[handle]!],
          images: [
            { url: placeholder(800, 1000, product.title) },
            { url: placeholder(800, 1000, `${product.title} — Alt`) },
          ],
          thumbnail: placeholder(400, 500, product.title),
          options: [{ title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
          variants: [
            {
              title: 'Default',
              sku: `${slug}-default`,
              prices: [{ amount: product.price, currency_code: 'inr' }],
              options: { Size: 'M' },
            } as any,
          ],
        },
      ])
    }
  }

  // ── 7. Featured Products ──────────────────────────────────────────────────
  logger.info('Creating featured products…')
  for (const product of FEATURED_PRODUCTS) {
    await productModuleService.createProducts([
      {
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: 'published' as any,
        images: [{ url: product.imageUrl }],
        thumbnail: product.imageUrl,
        options: [{ title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
        variants: [
          {
            title: 'Default',
            sku: `${product.handle}-default`,
            prices: [{ amount: product.price, currency_code: 'inr' }],
            options: { Size: 'M' },
          } as any,
        ],
      },
    ])
  }

  logger.info('✅ Seed complete! Products, region, and sales channel created.')
}
