import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'dtm_user',
  password: 'dtm_password',
  database: 'dont_tell_mama',
})

export { pool }
