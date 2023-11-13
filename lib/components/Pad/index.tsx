import tw, {styled} from 'twin.macro';
import * as esbuildModule from 'esbuild-wasm';
import {FC, useCallback, useMemo, useRef, useState} from 'react';
import {type Context as VmContext, runInNewContext} from 'vm';
import {PadEditor} from '../PadEditor';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {AsyncStatusesEnum, Handler} from '../../types';

/*
 * Types.
 */

type Esbuild = typeof esbuildModule;

type PadProps = {
  title?: string;
  hasFocus?: boolean;
  onFocus?: Handler;
  onBlur?: Handler;
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

const StyledOutputDiv = tw.div`container justify-start whitespace-pre-line bg-gradient-to-b text-white from-[#2e026d] to-[#15162c]`;

/*
 * Component
 */

export const Pad: FC<PadProps> = ({title, hasFocus, onFocus, onBlur}) => {
  const esbuild = useEsbuild();

  const [code, setCode] = useState<string>('');
  const [lines, setLines] = useState<readonly string[]>([]);

  const [runStatus, setRunStatus] = useState<AsyncStatusesEnum>(AsyncStatusesEnum.IDLE);

  const onChange = (value?: string) => {
    if (!value) return;
    setCode(value);
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

      const context = sandboxRun(res.code, logCb);
      console.log(context);
      setRunStatus(AsyncStatusesEnum.SUCCESS);
    } catch (error) {
      console.error(error);
      setRunStatus(AsyncStatusesEnum.ERROR);
    }
  }, [code, esbuild]);

  const onRunClick = run;

  const onResetClick = () => {
    setRunStatus(AsyncStatusesEnum.IDLE);
    setLines([]);
  };

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
      <PadEditor defaultValue={code} onChange={onChange} onCmdEnter={run} onFocus={onFocus} onBlur={onBlur} />
      <StyledOutputDiv>{output}</StyledOutputDiv>
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

function sandboxRun(code: string, logCb: (line: string) => void): VmContext {
  const log = (...values: ReadonlyArray<unknown>) => {
    console.log(...values);

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

  const context: VmContext = {
    console: {log, info: log, warn: log, error: log}
  };

  runInNewContext(code, context);

  return context;
}
