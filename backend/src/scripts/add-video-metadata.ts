import type { ExecArgs } from '@medusajs/framework/types'
import { updateProductsWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'

const VIDEO_URLS: Record<string, string> = {
  'product-1': 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011483/04_fhv4aw.mp4',
  'product-2': 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011292/01_arharw.mp4',
  'product-3': 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011392/02_ksi1ld.mp4',
  'product-4': 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011437/03_ykkxkx.mp4',
  'product-5': 'https://res.cloudinary.com/thx8mokj/video/upload/v1785752713/05_wxajfy.mp4',
}

export default async function addVideoMetadata({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const productModuleService = container.resolve(Modules.PRODUCT)

  for (const [handle, videoUrl] of Object.entries(VIDEO_URLS)) {
    const existing = await productModuleService.listProducts({ handle })
    if (existing.length === 0) {
      logger.info(`Skipping ${handle} — not found`)
      continue
    }
    const product = existing[0]!
    logger.info(`Setting video metadata for ${product.title}...`)
    await updateProductsWorkflow(container).run({
      input: {
        products: [
          {
            id: product.id,
            metadata: { video_url: videoUrl },
          },
        ],
      },
    })
    logger.info(`Done: ${product.title}`)
  }

  logger.info('✅ All video metadata set.')
}