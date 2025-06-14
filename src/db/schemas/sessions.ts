import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const sessionTable = pgTable('sessions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: text('session_id').unique().notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});