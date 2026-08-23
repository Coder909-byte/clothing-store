import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createProductVariantsWorkflow } from "@medusajs/medusa/core-flows"

// Step 2 of 2 — run after add-xxs-variants.ts (in a separate process) has
// added "XXS" as an allowed Size option value.
const TARGETS: { productId: string; price: number }[] = [
  { productId: "prod_01KZB9GPJ5ARKJ936TY5XR8G7D", price: 13000 }, // Celestial Maze
  { productId: "prod_01KZB9GQAN916GT4KDQ8TN8B3G", price: 12000 }, // Ivory Dust
  { productId: "prod_01KZB9GQSCVQ0ATA5FZG1SQ6ZB", price: 12000 }, // Cocoa Dusk
  { productId: "prod_01KZB9GR42A5RX8A82C0H35JMW", price: 13000 }, // Moonveil
]

export default async function createXxsVariants({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  for (const { productId, price } of TARGETS) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "variants.title"],
      filters: { id: productId },
    })
    const product = products[0]
    if (!product) {
      logger.error(`Product ${productId} not found, skipping`)
      continue
    }
    if (product.variants?.some((v: any) => v.title === "XXS")) {
      logger.info(`${product.title} already has an XXS variant, skipping`)
      continue
    }

    logger.info(`Creating XXS variant for ${product.title}…`)
    await createProductVariantsWorkflow(container).run({
      input: {
        product_variants: [
          {
            product_id: productId,
            title: "XXS",
            sku: `${product.handle}-xxs`,
            options: { Size: "XXS" },
            prices: [{ amount: price, currency_code: "inr" }],
          } as any,
        ],
      },
    })
    logger.info(`✅ Created XXS variant for ${product.title}`)
  }
}
