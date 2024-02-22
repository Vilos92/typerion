import {type TypnbCellSchema, TypnbCellTypesEnum} from '../typnb';
import {type Typnb} from '../typnb';
import {type NotebookState} from './types';

/*
 * Selectors.
 */

export const getTypnb = (state: NotebookState): Typnb => {
  const cells: ReadonlyArray<TypnbCellSchema> = state.pads.map(pad => ({
    cell_type: TypnbCellTypesEnum.CODE,
    source: pad.code
  }));
  return {cells};
};
