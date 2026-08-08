import type { ExecArgs } from '@medusajs/framework/types'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL']
const SALES_CHANNEL_ID = 'sc_01KZ8EA7B11BH5693YK62HZPDJ'

export default async function fixProduct1({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const inventoryModuleService = container.resolve(Modules.INVENTORY)

  // Clean up leftover inventory items from the failed run
  const skus = SIZES.map((s) => `product-1-${s.toLowerCase()}`)
  for (const sku of skus) {
    const items = await inventoryModuleService.listInventoryItems({ sku })
    if (items.length > 0) {
      logger.info(`Deleting leftover inventory item: ${sku}`)
      await inventoryModuleService.deleteInventoryItems(items.map((i) => i.id))
    }
  }

  logger.info('Recreating Golden Haze (product-1)...')
  await createProductsWorkflow(container).run({
    input: {
      products: [{
        title: 'Golden Haze',
        handle: 'product-1',
        description: 'A beautifully crafted piece.',
        status: 'published' as any,
        images: [
          { url: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg' },
          { url: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012304/DSC_0406_sgg6qh.jpg' },
          { url: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012304/DSC_0398_ctcvyb.jpg' },
        ],
        thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg',
        metadata: { video_url: 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011483/04_fhv4aw.mp4' },
        sales_channels: [{ id: SALES_CHANNEL_ID }],
        options: [{ title: 'Size', values: SIZES }],
        variants: SIZES.map((size) => ({
          title: size,
          sku: `product-1-${size.toLowerCase()}`,
          options: { Size: size },
          prices: [{ amount: 13999, currency_code: 'inr' }],
        })) as any,
      }],
    },
  })
  logger.info('✅ Golden Haze fully restored with XXS-XL, images, and video.')
}