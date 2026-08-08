import type { ExecArgs } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'

const STOCK_LOCATION_ID = 'sloc_01KZ8EA7DJ463GGSHVT2TG6YWW'

export default async function fixInventoryLevels({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  const inventoryModuleService = container.resolve(Modules.INVENTORY)

  const { data: items } = await container.resolve('query').graph({
    entity: 'inventory_item',
    fields: ['id', 'sku'],
  })

  logger.info(`Found ${items.length} inventory items`)

  for (const item of items) {
    const existingLevels = await inventoryModuleService.listInventoryLevels({
      inventory_item_id: item.id,
      location_id: STOCK_LOCATION_ID,
    })
    if (existingLevels.length > 0) {
      logger.info(`Skipping ${item.sku} — level already exists`)
      continue
    }
    await inventoryModuleService.createInventoryLevels([
      {
        inventory_item_id: item.id,
        location_id: STOCK_LOCATION_ID,
        stocked_quantity: 100,
      },
    ])
    logger.info(`Set stock for ${item.sku}: 100 units`)
  }

  logger.info('✅ All inventory levels set.')
}
