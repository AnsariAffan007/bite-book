import { integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { recipesTable } from "./recipes";

export const stepConnectionsTable = pgTable(
  'step_connections',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    recipeId: integer().notNull().references(() => recipesTable.id),
    sourceStepId: varchar('source_step_id', { length: 10 }).notNull(),
    targetStepId: varchar('target_step_id', { length: 10 }).notNull(),
    sourceHandle: varchar('source_handle', { enum: ['source-top-1', 'source-right-2', 'source-bottom-3', 'source-left-4'] }).notNull(),
    targetHandle: varchar('target_handle', { enum: ['target-top-1', 'target-right-2', 'target-bottom-3', 'target-left-4'] }).notNull()
  },
  (table) => ([
    unique().on(table.recipeId, table.sourceStepId, table.targetStepId)
  ])
)