import type { ExecArgs } from '@medusajs/framework/types'
import { updateShippingOptionsWorkflow } from '@medusajs/medusa/core-flows'

export default async function fixShippingPrice({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  await updateShippingOptionsWorkflow(container).run({
    input: [
      {
        id: 'so_manual_india',
        prices: [{ currency_code: 'inr', amount: 99 }],
      },
    ],
  })
  logger.info('✅ Shipping option price set.')
}
