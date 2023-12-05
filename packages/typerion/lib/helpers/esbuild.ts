import * as esbuildModule from 'esbuild-wasm';
import {useRef, useState} from 'react';

import {AsyncStatusesEnum} from '../types';

/*
 * Types.
 */

type EsbuildModule = typeof esbuildModule;

type Esbuild = (code: string) => Promise<string>;

/*
 * Hooks.
 */

export function useEsbuild(): Esbuild | undefined {
  const asyncStatusRef = useRef(AsyncStatusesEnum.IDLE);
  const [esModule, setEsModule] = useState<EsbuildModule | undefined>(undefined);

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

  if (!esModule) {
    return undefined;
  }

  return async code => {
    const res = await esModule.build({
      stdin: {
        contents: code,
        loader: 'ts'
      },
      bundle: true,
      write: false,
      plugins: [httpModuleResolver()]
    });

    return res.outputFiles[0].text;
  };
}

/*
 * Plugins.
 */

function httpModuleResolver(): esbuildModule.Plugin {
  return {
    name: 'http',

    setup: (build: esbuildModule.PluginBuild) => {
      build.onResolve({filter: /.*/}, async (args: esbuildModule.OnResolveArgs) => {
        if (args.kind !== 'import-statement' && args.kind !== 'require-call') {
          throw Error(`Could not resolve: ${args.path}`);
        }

        if (checkIsValidUrl(args.path)) {
          throw Error(`Importing URLs is not supported: ${args.path}`);
        }

        if (args.importer === '<stdin>') {
          const path = new URL(args.path, 'https://unpkg.com/').toString();
          return {path, namespace: 'http-url'};
        }

        // (WIP) These are for relative imports that exist in a top-level import.
        if (args.path.includes('./') || args.path.startsWith('/')) {
          const importerRes = await fetch(args.importer);
          const url = importerRes.url;

          const reducedPath = args.path.startsWith('./') ? args.path.slice(2) : args.path;

          const path = new URL(reducedPath, url).toString();
          return {path, namespace: 'http-url'};
        }

        return {path: args.path};
      });

      build.onLoad({filter: /.*/, namespace: 'http-url'}, async (args: esbuildModule.OnLoadArgs) => {
        const pkgRes = await fetch(args.path);
        const contents = await pkgRes.text();

        return {contents};
      });
    }
  };
}

/*
 * Helpers.
 */

const getEsModule = makeGetEsModule();

function makeGetEsModule() {
  let esModule: EsbuildModule | undefined;

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

function checkIsValidUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
