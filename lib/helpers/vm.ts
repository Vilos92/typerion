import {runInNewContext} from 'vm';

import {VmContext} from '../types';

/*
 * Helpers.
 */

export function runVm(code: string, logCb: (line: string) => void, context?: VmContext): VmContext {
  const logContext = makeLogContext(logCb);

  const baseContext: VmContext = {
    ...logContext
  };

  const runContext = context ? {...context, ...baseContext} : baseContext;

  runInNewContext(code, runContext);

  return runContext;
}

function makeLogContext(logCb: (line: string) => void) {
  const logLine = (...values: ReadonlyArray<unknown>) => {
    const line = values
      .map(value => {
        if (typeof value === 'string') {
          return value;
        }

        return JSON.stringify(value);
      })
      .join(' ');

    logCb(line);
  };

  return {
    console: {
      log: makeLog(logLine, console.log),
      info: makeLog(logLine, console.info),
      warn: makeLog(logLine, console.warn),
      error: makeLog(logLine, console.error)
    }
  };
}

function makeLog(
  logLine: (...values: ReadonlyArray<unknown>) => void,
  log: (...values: ReadonlyArray<unknown>) => void
) {
  return (...values: ReadonlyArray<unknown>) => {
    log(...values);
    logLine(...values);
  };
}
