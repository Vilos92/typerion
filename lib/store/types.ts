import {type Context as VmContext} from 'vm';

import {type AsyncStatusesEnum, type Handler, type IStandaloneCodeEditor} from '../types';
import {type TypnbState} from '../typnb';

/*
 * Types.
 */

export type PadState = {
  id: string;
  code: string;
  context?: VmContext;
  editor?: IStandaloneCodeEditor;
};

type NotebookStateAttributes = {
  runStatus: AsyncStatusesEnum;
  focusedPadId?: string;
  pads: ReadonlyArray<PadState>;
};

type NotebookStateHandlers = {
  load: (typnb: TypnbState) => void;
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
