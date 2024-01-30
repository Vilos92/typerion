import {createContext, useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import {createStore, useStore} from 'zustand';

import {AsyncStatusesEnum, type IStandaloneCodeEditor} from '../types';
import {type Typnb} from '../typnb';
import {type NotebookState, type PadState} from './types';

/*
 * Types.
 */

type NotebookStore = ReturnType<typeof createNotebookStore>;

type NotebookStateProps = {
  typnb?: Typnb;
};

/*
 * Store.
 */

export const createNotebookStore = (initProps?: NotebookStateProps) => {
  const pads = initProps?.typnb?.cells.map(cell => ({
    id: uuidv4(),
    code: cell.source
  })) ?? [
    {
      id: uuidv4(),
      code: "import { zip, flatten } from 'lodash';\n\nwindow.zip = zip;\nwindow.flatten = flatten;"
    },
    {
      id: uuidv4(),
      code: "const zipped = window.zip(['Hello', 'this is'], ['world,', 'Typerion!']);\nconst flat = window.flatten(zipped);\nconsole.log(flat.join(' '));"
    }
  ];

  return createStore<NotebookState>(set => ({
    runStatus: AsyncStatusesEnum.IDLE,
    focusedPadId: undefined,
    pads,
    load: typnb => {
      set(state => {
        const pads = typnb.cells.map(cell => ({
          id: uuidv4(),
          code: cell.source
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
};

/*
 * Context.
 */

export const NotebookContext = createContext<NotebookStore | null>(null);

/*
 * Hooks.
 */

export function useNotebookStore(): NotebookState {
  const store = useContext(NotebookContext);
  if (!store) throw new Error('Missing NotebookContext.Provider in the tree');
  return useStore(store, s => s);
}

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
