import {type NotebookState} from './types';

/*
 * Enums.
 */

enum CellTypesEnum {
  CODE = 'code'
}

/*
 * Types.
 */

type TypnbCodeCell = {
  cell_type: CellTypesEnum.CODE;
  source: string;
};

type TypnbCell = TypnbCodeCell;

export type TypnbState = {
  cells: ReadonlyArray<TypnbCell>;
};

/*
 * Selectors.
 */

export const getTypnb = (state: NotebookState): TypnbState => {
  const cells: ReadonlyArray<TypnbCell> = state.pads.map(pad => ({
    cell_type: CellTypesEnum.CODE,
    source: pad.code
  }));
  return {cells};
};
