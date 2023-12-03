import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';

import {AsyncStatusesEnum, type IStandaloneCodeEditor} from '../types';
import {type NotebookState, type PadState} from './types';

/*
 * Store.
 */

export const useNotebookStore = create<NotebookState>(set => ({
  runStatus: AsyncStatusesEnum.IDLE,
  focusedPadId: undefined,
  pads: [
    {
      id: uuidv4(),
      code: "import { zip } from 'lodash';\nconsole.log(zip([1, 2], ['a', 'b']));",
      defaultCode: "import { zip } from 'lodash';\nconsole.log(zip([1, 2], ['a', 'b']));"
    }
  ],
  load: typnb => {
    set(state => {
      const pads = typnb.cells.map(cell => ({
        id: uuidv4(),
        code: cell.source,
        defaultCode: cell.source
      }));

      return {...state, pads};
    });
  },
  run: () => {
    set(state => {
      return {...state, runStatus: AsyncStatusesEnum.LOADING};
    });
  },
  stop: () => {
    set(state => {
      return {...state, runStatus: AsyncStatusesEnum.IDLE};
    });
  },
  updatePad: (id, pad) => {
    set(state => {
      const index = getPadIndex(state.pads, id);

      const updatedPads = [...state.pads.slice(0, index), pad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  },
  focusPad: id => {
    set(state => {
      return {...state, focusedPadId: id};
    });
  },
  blurPad: id => {
    set(state => {
      if (state.focusedPadId !== id) {
        return state;
      }

      return {...state, focusedPadId: undefined};
    });
  },
  insertPadBefore: (id, pad) => {
    set(state => {
      const index = getPadIndex(state.pads, id);

      const updatedPads = [...state.pads.slice(0, index), pad, ...state.pads.slice(index)];

      return {...state, pads: updatedPads};
    });
  },
  insertPadAfter: (id, pad) => {
    set(state => {
      const index = getPadIndex(state.pads, id);

      const updatedPads = [...state.pads.slice(0, index + 1), pad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  },
  setEditor: (id, editor: IStandaloneCodeEditor) => {
    set(state => {
      const index = getPadIndex(state.pads, id);

      const updatedPad = {...state.pads[index], editor};

      const updatedPads = [...state.pads.slice(0, index), updatedPad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  }
}));

/*
 * Helpers.
 */

function getPadIndex(pads: ReadonlyArray<PadState>, id: string): number {
  const index = pads.findIndex(pad => pad.id === id);

  if (index === -1) {
    throw new Error(`Could not find pad with id ${id}`);
  }

  return index;
}
