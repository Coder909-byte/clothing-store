import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connection: { ssl: false },
    },
    http: {
      storeCors: process.env.STORE_CORS ?? 'http://localhost:3000',
  adminCors: process.env.ADMIN_CORS ?? 'http://localhost:3000',
  authCors: process.env.AUTH_CORS ?? 'http://localhost:3000',
      jwtSecret: process.env.JWT_SECRET ?? 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET ?? 'supersecret',
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000',
    disable: false,
  },
  modules: [
    // ── Core modules (all default Medusa v2 modules) ──────────────────────
    {
      resolve: '@medusajs/medusa/product',
      key: Modules.PRODUCT,
    },
    {
      resolve: '@medusajs/medusa/cart',
      key: Modules.CART,
    },
    {
      resolve: '@medusajs/medusa/order',
      key: Modules.ORDER,
    },
    {
      resolve: '@medusajs/medusa/customer',
      key: Modules.CUSTOMER,
    },
    {
      resolve: '@medusajs/medusa/payment',
      key: Modules.PAYMENT,
      options: {
        providers: [
          {
            resolve: '@devx-commerce/razorpay/providers/payment-razorpay',
            id: 'razorpay',
            options: {
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/inventory',
      key: Modules.INVENTORY,
    },
    {
      resolve: '@medusajs/medusa/stock-location',
      key: Modules.STOCK_LOCATION,
    },
    {
      resolve: '@medusajs/medusa/auth',
      key: Modules.AUTH,
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/auth-emailpass',
            id: 'emailpass',
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/region',
      key: Modules.REGION,
    },
    {
      resolve: '@medusajs/medusa/sales-channel',
      key: Modules.SALES_CHANNEL,
    },
    {
      resolve: '@medusajs/medusa/currency',
      key: Modules.CURRENCY,
    },
    {
      resolve: '@medusajs/medusa/tax',
      key: Modules.TAX,
    },
    {
      resolve: '@medusajs/medusa/fulfillment',
      key: Modules.FULFILLMENT,
    },
    {
      resolve: '@medusajs/medusa/pricing',
      key: Modules.PRICING,
    },
  ],
})
