import type { ExecArgs } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'

const PRODUCT_MEDIA: Record<string, { thumbnail: string; view2: string; view3: string; video: string }> = {
  'product-1': {
    thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785750195/DSC00367_mmjpcb.jpg',
    view2: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012304/DSC_0406_sgg6qh.jpg',
    view3: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012304/DSC_0398_ctcvyb.jpg',
    video: 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011483/04_fhv4aw.mp4',
  },
  'product-2': {
    thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751684/ac0c006f-f437-4853-bcda-b35984240d33_mmioak.jpg',
    view2: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012154/DSC_0015_g1bp72.jpg',
    view3: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012175/DSC_0048_obiai6.jpg',
    video: 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011292/01_arharw.mp4',
  },
  'product-3': {
    thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751734/c1a2255a-0677-4108-8189-153ed282a41d_mzgqgp.jpg',
    view2: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012247/DSC_0157_nnqd5r.jpg',
    view3: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012206/DSC_0174_nv8j5d.jpg',
    video: 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011392/02_ksi1ld.mp4',
  },
  'product-4': {
    thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785751819/ace583f9-f928-403c-af7c-d213621a8dda_bcf540.jpg',
    view2: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012305/DSC_0326_tuoxgg.jpg',
    view3: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012305/DSC_0291_jqihup.jpg',
    video: 'https://res.cloudinary.com/thx8mokj/video/upload/v1786011437/03_ykkxkx.mp4',
  },
  'product-5': {
    thumbnail: 'https://res.cloudinary.com/thx8mokj/image/upload/v1785752903/1864aca2-2ffd-4acc-aaaf-01bb5e1cfc41_xxbvtt.jpg',
    view2: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012116/IMG_2660_gx7jqu.jpg',
    view3: 'https://res.cloudinary.com/thx8mokj/image/upload/v1786012303/DSC_0550_zbn98m.jpg',
    video: 'https://res.cloudinary.com/thx8mokj/video/upload/v1785752713/05_wxajfy.mp4',
  },
}

export default async function addProductMedia({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const productModuleService = container.resolve(Modules.PRODUCT)

  for (const [handle, media] of Object.entries(PRODUCT_MEDIA)) {
    const existing = await productModuleService.listProducts({ handle })
    if (existing.length === 0) {
      logger.info(`Skipping ${handle} — not found`)
      continue
    }
    const product = existing[0]!
    logger.info(`Updating media for ${product.title}...`)
    await productModuleService.updateProducts(product.id, {
      images: [
        { url: media.thumbnail },
        { url: media.view2 },
        { url: media.view3 },
      ],
      metadata: { video_url: media.video },
    })
    logger.info(`Done: ${product.title} now has 3 images + video metadata`)
  }

  logger.info('✅ All product media updated.')
}