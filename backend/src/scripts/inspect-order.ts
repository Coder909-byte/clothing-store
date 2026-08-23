import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function inspectOrder({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const orderId = args[0]

  const { data } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "total",
      "item_total",
      "shipping_total",
      "tax_total",
      "summary.*",
      "currency_code",
      "customer.first_name",
      "customer.last_name",
      "customer.email",
      "customer.phone",
      "shipping_address.*",
      "items.title",
      "items.quantity",
      "items.detail.quantity",
      "items.unit_price",
      "items.metadata",
      "items.variant_title",
    ],
    filters: { id: orderId },
  })

  logger.info(JSON.stringify(data, null, 2))
}
