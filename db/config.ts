import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

(async() => {
  const data = await db.query.users.findFirst();
  console.log('email: ', data?.email)
})