import { Pool } from 'pg'

declare global {
  var pgPool: Pool | undefined
}

export const pool =
  global.pgPool ||
  new Pool({
    host: 'localhost',
    port: 5432,
    user: 'dtm_user',
    password: 'dtm_password',
    database: 'dont_tell_mama',
  })

if (process.env.NODE_ENV !== 'production') global.pgPool = pool
