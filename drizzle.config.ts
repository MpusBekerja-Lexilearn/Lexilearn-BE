import { defineConfig } from "drizzle-kit"
import { config } from "dotenv";

const environment = process.env.NODE_ENV
config({ path: `.env.${environment}` });


export default defineConfig({
    schema: './src/schema.ts',
    out: './supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
});