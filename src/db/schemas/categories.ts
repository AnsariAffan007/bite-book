import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 15 }).notNull().unique(),
  description: varchar({ length: 400 }),
  recipesCount: integer('recipes_count').notNull().default(0),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: 'cascade' })
})