import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User schema
export const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  twitterUsername: text('twitter_username'),
  github: text('github').references(() => platformCred.id),
  leetcode: text('leetcode').references(() => platformCred.id),
  bitbucket: text('bitbucket').references(() => platformCred.id),
  timezone: text({ enum: ["IST", "UTC", "GMT"] }), 
  jobFrequency: text( 'job_frequency', { enum: ["IST", "UTC", "GMT"] }),
  jobStartTime: text('job_start_time', { enum: ["24hrs", "12hrs", "6hrs"] }), 
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
  apiKey: text('api_key').notNull(),
  apiSecret: text('api_secret').notNull(),
  accessToken: text('access_token').notNull(),
  accessSecret: text('access_secret').notNull(),
  userId: text('user_id').references(() => users.userId)
});

export const platformCred = sqliteTable('platform_cred', {
  id: text('id').primaryKey(),
  active: integer({ mode: 'boolean' }).notNull(),
  username: text('username').notNull(),
});

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
export type PlatformCred = typeof platformCred.$inferSelect;
export type Tweet = typeof tweet.$inferSelect;