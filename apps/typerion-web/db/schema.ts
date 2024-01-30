import {type AnyPgColumn, integer, json, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';
import {type Typnb} from 'typerion';
import {z} from 'zod';

import {TypnbSchema} from './typnb';

/*
 * Tables.
 */

export const notebookTable = pgTable('notebook', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  typnb: json('typnb').notNull(),
  hash: text('hash').notNull(),
  parentId: integer('parent_id').references((): AnyPgColumn => notebookTable.id)
});

/*
 * Schemas.
 */

const NotebookSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  typnb: TypnbSchema,
  hash: z.string(),
  parentId: z.number().nullable()
});

/*
 * Schema types.
 */

type NotebookSelect = typeof notebookTable.$inferSelect;
type NotebookInsert = typeof notebookTable.$inferInsert;

/*
 * Types.
 */

type Notebook = z.infer<typeof NotebookSchema>;

/*
 * Decoders.
 */

export function decodeNotebook(data: NotebookSelect): Notebook {
  return NotebookSchema.parse(data);
}

/*
 * Serializers.
 */

export function serializeNotebook(data: Pick<Notebook, 'typnb' | 'hash' | 'parentId'>): NotebookInsert {
  return {
    typnb: data.typnb,
    hash: data.hash,
    parentId: data.parentId
  };
}

/*
 * Helpers.
 */

export async function hashTypnb(typnb: Typnb): Promise<string> {
  return await generateHash(JSON.stringify(typnb));
}

async function generateHash(inputString: string) {
  // Convert the input string to an array buffer
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);

  // Use the SubtleCrypto API to generate the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
