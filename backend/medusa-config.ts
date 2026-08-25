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
    disable: true,
  },
  modules: [
    {
      resolve: '@medusajs/medusa/fulfillment',
      key: Modules.FULFILLMENT,
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/fulfillment-manual',
            id: 'manual',
          },
        ],
      },
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
  ],
})