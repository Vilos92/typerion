import {json, pgTable, serial, timestamp} from 'drizzle-orm/pg-core';
import {type Typnb} from 'typerion';

import {decodeTypnb} from './typnb';

/*
 * Schema.
 */

export const notebookTable = pgTable('notebook', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  typnb: json('typnb').notNull()
});

/*
 * Schema types.
 */

type NotebookSelect = typeof notebookTable.$inferSelect;

/*
 * Types.
 */

type Notebook = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  typnb: Typnb;
};

/*
 * Decoders.
 */

export function decodeNotebook(data: NotebookSelect): Notebook {
  return {
    id: data.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    typnb: decodeTypnb(data.typnb)
  };
}
