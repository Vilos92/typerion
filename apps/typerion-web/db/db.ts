import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_CONNECTION;
if (!connectionString) {
  throw new Error('DATABASE_CONNECTION environment variable not set');
}

export const sql = postgres(connectionString, {max: 1});

export const db = drizzle(sql);
