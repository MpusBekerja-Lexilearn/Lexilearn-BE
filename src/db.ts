import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString, {debug: true})

export const db = drizzle(client, {schema}); 