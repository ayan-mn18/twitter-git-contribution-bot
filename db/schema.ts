import {
  sqliteTable,
  text,
  integer,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User schema
export const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  email: text('email').unique(),
  github_username: text('github_username'),
  leetcode_username: text('leetcode_username'),
  bitbucket_username: text('bitbucket_username'),
  timezone: text('timezone', { enum: ["IST", "UTC", "GMT"] }), 
  jobFrequency: text('job_frequency', { enum: ["24hrs", "12hrs", "6hrs"] }),
  jobStartTime: text('job_start_time'), 
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// xCred schema
export const xCred = sqliteTable('x_cred', {
  id: text('id').primaryKey(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  userId: text('user_id').references(() => users.userId),
  twitterUsername: text('twitter_username').notNull().unique(),
});

// tweet
export const tweet = sqliteTable('tweets', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.userId),
  content: text('content').notNull(),
  postedAt: integer('posted_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`
  ).notNull(),
});

export type User = typeof users.$inferSelect;
export type XCred = typeof xCred.$inferSelect;
export type Tweet = typeof tweet.$inferSelect;