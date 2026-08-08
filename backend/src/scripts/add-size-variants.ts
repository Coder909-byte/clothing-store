import type { ExecArgs } from '@medusajs/framework/types'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'

const PRODUCTS = [
  { handle: 'product-1', title: 'Golden Haze', price: 13999, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg' },
  { handle: 'product-2', title: 'Celestial Maze', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751684/ac0c006f-f437-4853-bcda-b35984240d33_mmioak.jpg' },
  { handle: 'product-3', title: 'Ivory Dust', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751734/c1a2255a-0677-4108-8189-153ed282a41d_mzgqgp.jpg' },
  { handle: 'product-4', title: 'Cocoa Dusk', price: 12000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751819/ace583f9-f928-403c-af7c-d213621a8dda_bcf540.jpg' },
  { handle: 'product-5', title: 'Moonveil', price: 13000, imageUrl: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785752903/1864aca2-2ffd-4acc-aaaf-01bb5e1cfc41_xxbvtt.jpg' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SALES_CHANNEL_ID = 'sc_01KZ8EA7B11BH5693YK62HZPDJ'

export default async function addSizeVariants({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const productModuleService = container.resolve(Modules.PRODUCT)

  for (const product of PRODUCTS) {
    const existing = await productModuleService.listProducts({ handle: product.handle })
    if (existing.length > 0) {
      logger.info(`Deleting existing ${product.title}...`)
      await productModuleService.deleteProducts([existing[0]!.id])
    }

    logger.info(`Recreating ${product.title} with ${SIZES.length} size variants...`)
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
            options: [{ title: 'Size', values: SIZES }],
            variants: SIZES.map((size) => ({
              title: size,
              sku: `${product.handle}-${size.toLowerCase()}`,
              options: { Size: size },
              prices: [{ amount: product.price, currency_code: 'inr' }],
            })) as any,
          },
        ],
      },
    })
    logger.info(`Created ${product.title} with sizes: ${SIZES.join(', ')}`)
  }

  logger.info('✅ All products now have real size variants.')
}