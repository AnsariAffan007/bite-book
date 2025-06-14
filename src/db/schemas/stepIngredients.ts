import { doublePrecision, integer, pgTable, unique } from "drizzle-orm/pg-core";
import { ingredientsTable } from "./ingredients";
import { stepsTable } from "./steps";

export const stepIngredientsTable = pgTable(
  'step_ingredients',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ingredientId: integer().notNull().references(() => ingredientsTable.id, { onDelete: 'cascade' }),
    quantity: doublePrecision().notNull(),
    stepId: integer().notNull().references(() => stepsTable.id, { onDelete: 'cascade' })
  },
  (table) => ([
    unique().on(table.ingredientId, table.stepId)
  ])
)