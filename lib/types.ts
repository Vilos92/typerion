import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import {Context as VmContext} from 'vm';

/*
 * Package types.
 */

export {type Context as VmContext} from 'vm';

export type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;

/*
 * Enums.
 */

export enum AsyncStatusesEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/*
 * Types.
 */

export type Handler = () => void;

export type PadState = {
  id: string;
  context?: VmContext;
  editor?: IStandaloneCodeEditor;
};
