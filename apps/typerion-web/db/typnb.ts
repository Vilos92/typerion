import {type Typnb} from 'typerion';
import {z} from 'zod';

/*
 * Enums.
 */

enum TypnbCellTypesEnum {
  CODE = 'code'
}

/*
 * Runtime types.
 */

const TypnbCodeCellSchema = z.object({
  cell_type: z.literal(TypnbCellTypesEnum.CODE),
  source: z.string()
});

const TypnbCellSchema = z.discriminatedUnion('cell_type', [TypnbCodeCellSchema]);

export const TypnbSchema = z.object({
  cells: z.array(TypnbCellSchema).readonly()
});

/*
 * Decoders.
 */

export function decodeTypnb(data: unknown): Typnb {
  return TypnbSchema.parse(data);
}
