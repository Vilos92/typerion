import {json, pgTable, serial, timestamp} from 'drizzle-orm/pg-core';

export const notebookTable = pgTable('notebook', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  typnb: json('typnb').notNull()
});
