export {type Context as VmContext} from 'vm';

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
