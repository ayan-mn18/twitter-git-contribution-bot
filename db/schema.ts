import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  // subscriptionId: text('subscription_id').references(() => subscriptions.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
      sql`CURRENT_TIMESTAMP`
  ),
});


export type User = typeof users.$inferSelect;