import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from 'postgres'

const connectionString = Bun.env.DATABASE_URL
const client = postgres(connectionString)

export const db = drizzle(client, {schema}); 