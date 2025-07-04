import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const resetPassTokensTable = pgTable('reset_pass_tokens', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: text('token').notNull(),
  userId: integer().references(() => usersTable.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})