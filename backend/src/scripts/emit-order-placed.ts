import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function emitOrderPlaced({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const eventBus = container.resolve(Modules.EVENT_BUS)
  const orderId = args[0]
  if (!orderId) {
    logger.error("Usage: medusa exec ./src/scripts/emit-order-placed.ts <order_id>")
    return
  }
  logger.info(`Emitting order.placed for ${orderId}…`)
  await eventBus.emit({ name: "order.placed", data: { id: orderId } })
  logger.info("Emit call returned, waiting for async subscribers to finish…")
  await new Promise((r) => setTimeout(r, 6000))
  logger.info("Done waiting.")
}
