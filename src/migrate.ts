import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

const migrator = async () => {
    try {
        await migrate(db, {migrationsFolder: "./supabase/migrations", migrationsSchema: "public"})
        console.log("Migrated successfully")
        process.exit(0)
    } catch(e) {
        console.log(e)
        process.exit(1)
    }
}

migrator()