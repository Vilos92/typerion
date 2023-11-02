import tw from 'twin.macro';
import Editor from '@monaco-editor/react';
import * as esbuildModule from 'esbuild-wasm';
import {FC, useRef, useState} from 'react';
import {type Context as VmContext, runInNewContext} from 'vm';

/*
 * Types.
 */

type Esbuild = typeof esbuildModule;

enum AsyncStatusesEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/*
 * Styles.
 */

const StyledMain = tw.main`flex flex-col bg-gradient-to-b text-white from-[#2e026d] to-[#15162c]`;

const StyledButton = tw.button`w-full bg-red-300`;

const StyledCompiledDiv = tw.div`container justify-start`;

const StyledOutputDiv = tw.div`container justify-start whitespace-pre-line`;

/*
 * Component
 */

export const Pad: FC = () => {
  const esbuild = useEsbuild();

  const [code, setCode] = useState<string>('');
  const [compiled, setCompiled] = useState('');
  const [output, setOutput] = useState('');

  if (!esbuild) {
    return null;
  }

  const onChange = (value?: string) => {
    if (!value) return;
    setCode(value);
  };

  const logCb = (line: string) => {
    setOutput(prevOutput => {
      const newOutput = `${prevOutput}\n${line}`;
      return newOutput;
    });
  };

  const onInterpretClick = async () => {
    setOutput('');
    const res = await esbuild.transform(code, {loader: 'ts'});
    setCompiled(res.code);
    const context = sandboxRun(res.code, logCb);
    console.log(context);
  };

  return (
    <StyledMain>
      <Editor height="300px" defaultLanguage="typescript" defaultValue={code} onChange={onChange} />
      <StyledButton onClick={onInterpretClick}>Interpret</StyledButton>
      <StyledCompiledDiv>{compiled}</StyledCompiledDiv>
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
    console: {log}
  };

  runInNewContext(code, context);

  return context;
}
