import {type Context as VmContext} from 'vm';

import {type AsyncStatusesEnum, type Handler, type IStandaloneCodeEditor} from '../types';

/*
 * Types.
 */

export type PadState = {
  id: string;
  defaultCode?: string;
  context?: VmContext;
  editor?: IStandaloneCodeEditor;
};

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

export type NotebookState = NotebookStateAttributes & NotebookStateHandlers;
