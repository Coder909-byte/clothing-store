import type { ExecArgs } from '@medusajs/framework/types'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'

const FEATURED_PRODUCTS = [
  { handle: 'product-1', title: 'Golden Haze', price: 13999, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg' },
  { handle: 'product-2', title: 'Celestial Maze', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751684/ac0c006f-f437-4853-bcda-b35984240d33_mmioak.jpg' },
  { handle: 'product-3', title: 'Ivory Dust', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751734/c1a2255a-0677-4108-8189-153ed282a41d_mzgqgp.jpg' },
  { handle: 'product-4', title: 'Cocoa Dusk', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751819/ace583f9-f928-403c-af7c-d213621a8dda_bcf540.jpg' },
  { handle: 'product-5', title: 'Moonveil', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785752903/1864aca2-2ffd-4acc-aaaf-01bb5e1cfc41_xxbvtt.jpg' },
]

const OLD_PRODUCT_IDS = [
  'prod_01KZ8EA93XWN2XPVXE9DAFVXHB',
  'prod_01KZ8EA957MHP7MCY9TMS5KT0H',
  'prod_01KZ8EA96E6HG2NNAQ9NRGN57F',
  'prod_01KZ8EA97Q0MSS7XP91FWNPC25',
  'prod_01KZ8EA993FW5DXE4TJZB76YXX',
]

const SALES_CHANNEL_ID = 'sc_01KZ8EA7B11BH5693YK62HZPDJ'

export default async function recreateFeatured({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info('Deleting old un-priced products...')
  await productModuleService.deleteProducts(OLD_PRODUCT_IDS)

  logger.info('Recreating products via workflow (properly links pricing)...')
  for (const product of FEATURED_PRODUCTS) {
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: product.title,
            handle: product.handle,
            description: 'A beautifully crafted piece.',
            status: 'published' as any,
            images: [{ url: product.imageUrl }],
            thumbnail: product.imageUrl,
            sales_channels: [{ id: SALES_CHANNEL_ID }],
            options: [{ title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
            variants: [
              {
                title: 'Default',
                sku: `${product.handle}-default`,
                options: { Size: 'M' },
                prices: [{ amount: product.price, currency_code: 'inr' }],
              } as any,
            ],
          },
        ],
      },
    })
    logger.info(`Created ${product.title} — ₹${product.price}`)
  }

  logger.info('✅ All 5 products recreated with working prices.')
}
