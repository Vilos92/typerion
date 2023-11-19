import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';

import {AsyncStatusesEnum, Handler, IStandaloneCodeEditor, PadState} from './types';

/*
 * Types.
 */

type NotebookStateAttributes = {
  runStatus: AsyncStatusesEnum;
  focusedPadId?: string;
  pads: readonly PadState[];
};

type NotebookStateHandlers = {
  run: Handler;
  stop: Handler;
  updatePad: (id: string, pad: PadState) => void;
  focusPad: (id: string) => void;
  blurPad: (id: string) => void;
  insertPadBefore: (id: string, pad: PadState) => void;
  insertPadAfter: (id: string, pad: PadState) => void;
  setEditor: (id: string, editor: IStandaloneCodeEditor) => void;
};

type NotebookState = NotebookStateAttributes & NotebookStateHandlers;

/*
 * Store.
 */

export const useNotebookStore = create<NotebookState>(set => ({
  runStatus: AsyncStatusesEnum.IDLE,
  focusedPadId: undefined,
  pads: [
    {
      id: uuidv4()
    }
  ],
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
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

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
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPads = [...state.pads.slice(0, index), pad, ...state.pads.slice(index)];

      return {...state, pads: updatedPads};
    });
  },
  insertPadAfter: (id, pad) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPads = [...state.pads.slice(0, index + 1), pad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  },
  setEditor: (id, editor: IStandaloneCodeEditor) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPad = {...state.pads[index], editor};

      const updatedPads = [...state.pads.slice(0, index), updatedPad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  }
}));
