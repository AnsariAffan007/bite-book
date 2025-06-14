import { integer, pgTable, text, unique, varchar } from "drizzle-orm/pg-core";
import { recipesTable } from "./recipes";

export const stepsTable = pgTable(
  'steps',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    recipeId: integer('recipe_id').notNull().references(() => recipesTable.id, { onDelete: 'cascade' }),
    stepId: varchar('step_id', { length: 10 }).notNull(),
    width: integer().notNull(),
    height: integer().notNull(),
    x: integer().notNull(),
    y: integer().notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    description: text()
  },
  (table) => (
    [
      unique().on(table.recipeId, table.stepId),
      unique().on(table.recipeId, table.name),
    ]
  )
)