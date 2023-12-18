import {type FC, useCallback, useEffect, useMemo, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {useEsbuild} from '../../helpers/esbuild';
import {runVm} from '../../helpers/vm';
import {AsyncStatusesEnum, type Handler, type IStandaloneCodeEditor, type VmContext} from '../../types';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {PadEditor} from './PadEditor';

/*
 * Types.
 */

type PadProps = {
  title?: string;
  defaultCode?: string;
  context?: VmContext;
  shouldAutoRun?: boolean;
  hasFocus?: boolean;
  onFocus?: Handler;
  onBlur?: Handler;
  onChange?: (value: string) => void;
  onRunComplete?: (context: VmContext) => void;
  onShiftEnterComplete?: Handler;
  onCmdUp?: Handler;
  onCmdDown?: Handler;
  setEditor?: (editor: IStandaloneCodeEditor) => void;
};

type StyledMainProps = {
  $runStatus: AsyncStatusesEnum;
  $isClean: boolean;
  $hasFocus?: boolean;
};

/*
 * Styles.
 */

const StyledMain = styled.main<StyledMainProps>`
  ${tw`flex flex-col rounded-md border-2 border-l-8 bg-stone-300 dark:bg-stone-700 pt-1 text-black dark:text-white`}

  ${({$runStatus, $isClean, $hasFocus}) => {
    if (!$isClean && $hasFocus) {
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

const StyledOutputPre = tw.pre`container justify-start px-4 text-sm bg-stone-200 text-black dark:bg-stone-700 dark:text-white`;

/*
 * Component
 */

export const Pad: FC<PadProps> = ({
  title,
  defaultCode,
  context,
  shouldAutoRun,
  hasFocus,
  onFocus,
  onBlur,
  onChange,
  onRunComplete,
  onShiftEnterComplete,
  onCmdUp,
  onCmdDown,
  setEditor
}) => {
  const esbuild = useEsbuild();

  const [code, setCode] = useState<string>(defaultCode ?? '');

  const [logs, setLogs] = useState<readonly string[]>([]);

  const [runStatus, setRunStatus] = useState<AsyncStatusesEnum>(AsyncStatusesEnum.IDLE);

  // If the editor has not been modified since the last run, it is clean.
  const [isClean, setIsClean] = useState<boolean>(true);

  const onEditorChange = (value?: string) => {
    if (!value) return;

    setIsClean(false);

    setCode(value);
    setRunStatus(AsyncStatusesEnum.IDLE);

    onChange?.(value);
  };

  const logCb = (log: string) => {
    setLogs(prevLines => [...prevLines, log]);
  };

  const run = useCallback(async () => {
    if (!esbuild) {
      throw new Error('Cannot run code without esbuild');
    }

    setIsClean(true);

    try {
      setRunStatus(AsyncStatusesEnum.LOADING);
      setLogs([]);

      const builtCode = await esbuild(code);

      const runContext = runVm(builtCode, logCb, context);
      console.log(runContext);
      setRunStatus(AsyncStatusesEnum.SUCCESS);

      onRunComplete?.(runContext);
    } catch (error) {
      console.error(error);
      setRunStatus(AsyncStatusesEnum.ERROR);
    }
  }, [code, context, esbuild, onRunComplete]);

  const onRunClick = run;
  const onCmdEnter = run;
  const onShiftEnter = async () => {
    await run();
    onShiftEnterComplete?.();
  };

  const onResetClick = () => {
    setRunStatus(AsyncStatusesEnum.IDLE);
    setLogs([]);
  };

  useEffect(() => {
    (async () => {
      if (shouldAutoRun && runStatus === AsyncStatusesEnum.IDLE && code) {
        await run();
      }
    })().catch(console.error);
  }, [code, run, runStatus, shouldAutoRun]);

  const indentLog = (log: string) => log.split('\n').join('\n\t');

  const output = useMemo(
    () => logs.map((log, index) => `${index + 1}\t${indentLog(log)}`).join('\n'),
    [logs]
  );

  return (
    <StyledMain $runStatus={runStatus} $isClean={isClean} $hasFocus={hasFocus}>
      <StyledHeaderMenu>
        <li>
          <StyledPlayButton onClick={onRunClick}>
            <Icon type={IconTypesEnum.PLAY} />
          </StyledPlayButton>
        </li>
        {title && <li>{title}</li>}
        <li>
          <StyledResetButton onClick={onResetClick}>
            <Icon type={IconTypesEnum.ARROW_COUNTER_CLOCKWISE} />
          </StyledResetButton>
        </li>
      </StyledHeaderMenu>
      <PadEditor
        defaultValue={code}
        onChange={onEditorChange}
        onCmdEnter={onCmdEnter}
        onShiftEnter={onShiftEnter}
        onCmdUp={onCmdUp}
        onCmdDown={onCmdDown}
        onFocus={onFocus}
        onBlur={onBlur}
        setEditor={setEditor}
      />
      {output && <StyledOutputPre>{output}</StyledOutputPre>}
    </StyledMain>
  );
};
