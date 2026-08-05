import type { ExecArgs } from '@medusajs/framework/types'
import { updateProductVariantsWorkflow } from '@medusajs/medusa/core-flows'

const PRICES: Record<string, number> = {
  variant_01KZ8EA93XZJK4WY5HX60XMJZ9: 13999, // Golden Haze
}

export default async function fixPrices({ container }: ExecArgs) {
  const logger = container.resolve('logger')

  for (const [variantId, amount] of Object.entries(PRICES)) {
    logger.info(`Setting price for variant ${variantId} -> ₹${amount}`)
    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: [
          {
            id: variantId,
            prices: [{ amount, currency_code: 'inr' }],
          },
        ],
      },
    })
  }

  logger.info('✅ Prices updated.')
}