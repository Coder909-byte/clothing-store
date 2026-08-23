import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductOptionsWorkflow } from "@medusajs/medusa/core-flows"

// Step 1 of 2 (run as its own `medusa exec` process, then run
// create-xxs-variants.ts separately — chaining both workflows in one
// process leaves the variant-creation step reading a stale option-values
// cache and it rejects "XXS" as not-yet-existing).
const PRODUCT_IDS = [
  "prod_01KZB9GPJ5ARKJ936TY5XR8G7D", // Celestial Maze
  "prod_01KZB9GQAN916GT4KDQ8TN8B3G", // Ivory Dust
  "prod_01KZB9GQSCVQ0ATA5FZG1SQ6ZB", // Cocoa Dusk
  "prod_01KZB9GR42A5RX8A82C0H35JMW", // Moonveil
]

export default async function addXxsOptionValues({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  for (const productId of PRODUCT_IDS) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "options.id", "options.title", "options.values.value"],
      filters: { id: productId },
    })
    const product = products[0]
    if (!product) {
      logger.error(`Product ${productId} not found, skipping`)
      continue
    }
    const sizeOption = product.options?.find((o: any) => o.title === "Size")
    if (!sizeOption) {
      logger.error(`${product.title} has no "Size" option, skipping`)
      continue
    }
    const currentValues = (sizeOption.values || []).map((v: any) => v.value)
    if (currentValues.includes("XXS")) {
      logger.info(`${product.title}: Size option already allows XXS, skipping`)
      continue
    }
    logger.info(`${product.title}: adding "XXS" to Size option values…`)
    await updateProductOptionsWorkflow(container).run({
      input: {
        selector: { id: sizeOption.id },
        update: { values: [...currentValues, "XXS"] },
      },
    })
  }
  logger.info("Done.")
}
