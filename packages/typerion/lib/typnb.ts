import {z} from 'zod';

/*
 * Enums.
 */

export enum TypnbCellTypesEnum {
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

const TypnbSchema = z.object({
  cells: z.array(TypnbCellSchema).readonly()
});

/*
 * Types.
 */

export type TypnbCellSchema = z.infer<typeof TypnbCellSchema>;

export type Typnb = z.infer<typeof TypnbSchema>;

/*
 * Decoders.
 */

export const decodeTypnb = (data: unknown): Typnb => {
  return TypnbSchema.parse(data);
};
