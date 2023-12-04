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
  setEditor?: (editor: IStandaloneCodeEditor) => void;
};

type StyledMainProps = {
  $runStatus: AsyncStatusesEnum;
  $hasFocus?: boolean;
};

/*
 * Styles.
 */

const StyledMain = styled.main<StyledMainProps>`
  ${tw`flex flex-col rounded-md border-2 border-l-8 bg-stone-300 dark:bg-stone-700 pt-1 text-black dark:text-white`}

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
  defaultCode,
  context,
  shouldAutoRun,
  hasFocus,
  onFocus,
  onBlur,
  onChange,
  onRunComplete,
  onShiftEnterComplete,
  setEditor
}) => {
  const esbuild = useEsbuild();

  const [code, setCode] = useState<string>(defaultCode ?? '');

  const [lines, setLines] = useState<readonly string[]>([]);

  const [runStatus, setRunStatus] = useState<AsyncStatusesEnum>(AsyncStatusesEnum.IDLE);

  const onEditorChange = (value?: string) => {
    if (!value) return;
    setCode(value);
    setRunStatus(AsyncStatusesEnum.IDLE);

    onChange?.(value);
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
            <Icon type={IconTypesEnum.ARROW_COUNTER_CLOCKWISE} />
          </StyledResetButton>
        </li>
      </StyledHeaderMenu>
      <PadEditor
        defaultValue={code}
        onChange={onEditorChange}
        onCmdEnter={onCmdEnter}
        onShiftEnter={onShiftEnter}
        onFocus={onFocus}
        onBlur={onBlur}
        setEditor={setEditor}
      />
      {output && <StyledOutputDiv>{output}</StyledOutputDiv>}
    </StyledMain>
  );
};
