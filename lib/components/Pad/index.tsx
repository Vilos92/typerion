import tw, {styled} from 'twin.macro';
import * as esbuildModule from 'esbuild-wasm';
import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {runInNewContext} from 'vm';
import {PadEditor} from '../PadEditor';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {AsyncStatusesEnum, Handler, VmContext} from '../../types';

/*
 * Types.
 */

type Esbuild = typeof esbuildModule;

type PadProps = {
  title?: string;
  context?: VmContext;
  shouldAutoRun?: boolean;
  hasFocus?: boolean;
  onFocus?: Handler;
  onBlur?: Handler;
  onPadRunComplete?: (context: VmContext) => void;
  setEditorHTML?: (editorHTML: HTMLElement) => void;
};

type StyledMainProps = {
  $runStatus: AsyncStatusesEnum;
  $hasFocus?: boolean;
};

/*
 * Styles.
 */

const StyledMain = styled.main<StyledMainProps>`
  ${tw`flex flex-col rounded-md border-2 border-l-8 bg-white pt-1 text-black`}

  ${({$runStatus, $hasFocus}) => {
    if ($hasFocus) {
      return tw`border-blue-500`;
    }

    switch ($runStatus) {
      case AsyncStatusesEnum.IDLE:
        return tw`border-gray-300`;
      case AsyncStatusesEnum.LOADING:
        return tw`border-yellow-300`;
      case AsyncStatusesEnum.SUCCESS:
        return tw`border-green-300`;
      case AsyncStatusesEnum.ERROR:
        return tw`border-red-300`;
    }
  }}
`;

const StyledHeaderMenu = tw.menu`flex flex-row justify-between px-2 pb-2`;

const StyledPlayButton = tw.button`rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700`;

const StyledResetButton = tw.button`rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700`;

const StyledOutputDiv = tw.div`container justify-start whitespace-pre-line bg-stone-700 text-white`;

/*
 * Component
 */

export const Pad: FC<PadProps> = ({
  title,
  context,
  shouldAutoRun,
  hasFocus,
  onFocus,
  onBlur,
  onPadRunComplete,
  setEditorHTML
}) => {
  const esbuild = useEsbuild();

  const [code, setCode] = useState<string>('');

  const [lines, setLines] = useState<readonly string[]>([]);

  const [runStatus, setRunStatus] = useState<AsyncStatusesEnum>(AsyncStatusesEnum.IDLE);

  const onChange = (value?: string) => {
    if (!value) return;
    setCode(value);
    setRunStatus(AsyncStatusesEnum.IDLE);
  };

  const logCb = (line: string) => {
    setLines(prevLines => [...prevLines, line]);
  };

  const run = useCallback(async () => {
    if (!esbuild) {
      throw new Error('Cannot run code without esbuild');
    }

    try {
      setRunStatus(AsyncStatusesEnum.LOADING);
      setLines([]);

      const res = await esbuild.transform(code, {loader: 'ts'});

      const runContext = sandboxRun(res.code, logCb, context);
      console.log(runContext);
      setRunStatus(AsyncStatusesEnum.SUCCESS);

      onPadRunComplete?.(runContext);
    } catch (error) {
      console.error(error);
      setRunStatus(AsyncStatusesEnum.ERROR);
    }
  }, [code, context, esbuild, onPadRunComplete]);

  const onRunClick = run;
  const onCmdEnter = run;

  const onResetClick = () => {
    setRunStatus(AsyncStatusesEnum.IDLE);
    setLines([]);
  };

  useEffect(() => {
    (async () => {
      if (shouldAutoRun && runStatus === AsyncStatusesEnum.IDLE && code) {
        await run();
      }
    })().catch(console.error);
  }, [code, run, runStatus, shouldAutoRun]);

  const output = useMemo(() => lines.join('\n'), [lines]);

  return (
    <StyledMain $runStatus={runStatus} $hasFocus={hasFocus}>
      <StyledHeaderMenu>
        <li>
          <StyledPlayButton onClick={onRunClick}>
            <Icon type={IconTypesEnum.PLAY} />
          </StyledPlayButton>
        </li>
        {title && <li>{title}</li>}
        <li>
          <StyledResetButton onClick={onResetClick}>
            <Icon type={IconTypesEnum.RESET} />
          </StyledResetButton>
        </li>
      </StyledHeaderMenu>
      <PadEditor
        defaultValue={code}
        onChange={onChange}
        onCmdEnter={onCmdEnter}
        onFocus={onFocus}
        onBlur={onBlur}
        setEditorHTML={setEditorHTML}
      />
      {output && <StyledOutputDiv>{output}</StyledOutputDiv>}
    </StyledMain>
  );
};

/*
 * Hooks.
 */

function useEsbuild(): Esbuild | undefined {
  const asyncStatusRef = useRef(AsyncStatusesEnum.IDLE);
  const [esModule, setEsModule] = useState<Esbuild | undefined>(undefined);

  if (asyncStatusRef.current === AsyncStatusesEnum.IDLE) {
    (async () => {
      asyncStatusRef.current = AsyncStatusesEnum.LOADING;
      const esModule = await getEsModule();
      setEsModule(() => esModule);
    })()
      .catch(error => {
        asyncStatusRef.current = AsyncStatusesEnum.ERROR;
        console.error(error);
      })
      .finally(() => {
        asyncStatusRef.current = AsyncStatusesEnum.SUCCESS;
      });
  }

  return esModule;
}

/*
 * Helpers.
 */

const getEsModule = makeGetEsModule();

function makeGetEsModule() {
  let esModule: Esbuild | undefined;

  return async () => {
    if (!esModule) {
      esModule = esbuildModule;
      try {
        await esbuildModule.initialize({
          wasmURL: './esbuild.wasm'
        });

        // Do not want to attempt initializing again.
        return;
      } catch {
        console.error('Failed to load esbuild.wasm from ./esbuild.wasm - falling back to unpkg.com');
      }

      try {
        await esbuildModule.initialize({
          wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm'
        });
      } catch (error) {
        console.error(error);
      }
    }

    return esModule;
  };
}

function sandboxRun(code: string, logCb: (line: string) => void, context?: VmContext): VmContext {
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
