import * as esbuildModule from 'esbuild-wasm';
import {useRef, useState} from 'react';

import {type Esbuild} from '../components/Pad';
import {AsyncStatusesEnum} from '../types';

/*
 * Hooks.
 */

export function useEsbuild(): Esbuild | undefined {
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
