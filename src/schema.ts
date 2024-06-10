import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    email: varchar('email', { length: 50 }).unique(),
    password: varchar('password', { length: 256 }),
    photo: varchar('photo', { length: 256 }).default("default.jpg"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});


// make type for the table infer the schema
export type users = InferSelectModel<typeof users>;