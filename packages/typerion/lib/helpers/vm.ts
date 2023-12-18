import {format as prettyFormat} from 'pretty-format';
import {runInNewContext} from 'vm';

import {type VmContext} from '../types';

/*
 * Helpers.
 */

export function runVm(code: string, logCb: (log: string) => void, context?: VmContext): VmContext {
  const logContext = makeLogContext(logCb);

  const baseContext: VmContext = {
    ...logContext
  };

  const runContext = context ? {...context, ...baseContext} : baseContext;

  runInNewContext(code, runContext);

  return runContext;
}

function makeLogContext(logCb: (log: string) => void) {
  const logLines = (...values: ReadonlyArray<unknown>) => {
    const lines = values.map(value => prettyFormat(value)).join('\n');

    logCb(lines);
  };

  return {
    console: {
      log: makeLogger(logLines, console.log),
      info: makeLogger(logLines, console.info),
      warn: makeLogger(logLines, console.warn),
      error: makeLogger(logLines, console.error)
    }
  };
}

function makeLogger(
  logLines: (...values: ReadonlyArray<unknown>) => void,
  consoleLog: (...values: ReadonlyArray<unknown>) => void
) {
  return (...values: ReadonlyArray<unknown>) => {
    consoleLog(...values);
    logLines(...values);
  };
}
