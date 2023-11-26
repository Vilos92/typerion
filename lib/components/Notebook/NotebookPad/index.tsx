import {type FC} from 'react';
import {v4 as uuidv4} from 'uuid';

import {useNotebookStore} from '../../../store/store';
import type {PadState} from '../../../store/types';
import {AsyncStatusesEnum, type IStandaloneCodeEditor, type VmContext} from '../../../types';
import {Pad} from '../../Pad';

/*
 * Components.
 */

export const NotebookPad: FC<{
  index: number;
  insertPadAfter: (id: string, pad: PadState) => void;
}> = ({index, insertPadAfter}) => {
  const {runStatus, focusedPadId, pads, updatePad, focusPad, blurPad, setEditor} = useNotebookStore();

  const pad = pads[index];

  const onPadFocus = (id: string) => {
    focusPad(id);
  };

  const onPadBlur = (id: string) => {
    blurPad(id);
  };

  const onChange = (value: string) => {
    updatePad(pad.id, {...pad, code: value});
  };

  const onRunComplete = (context: VmContext) => {
    updatePad(pad.id, {...pad, context});
  };

  const onShiftEnterComplete = () => {
    if (index === pads.length - 1) {
      insertPadAfter(pad.id, {id: uuidv4(), code: ''});
    }

    pads[index + 1]?.editor?.focus();
  };

  return (
    <Pad
      key={pad.id}
      title={renderPadTitle(index)}
      defaultCode={pad.defaultCode}
      context={getPreviousPadContext(pads, index)}
      shouldAutoRun={
        runStatus === AsyncStatusesEnum.LOADING &&
        (index === 0 || Boolean(getPreviousPadContext(pads, index)))
      }
      hasFocus={focusedPadId === pad.id}
      onFocus={() => onPadFocus(pad.id)}
      onBlur={() => onPadBlur(pad.id)}
      onChange={onChange}
      onRunComplete={onRunComplete}
      onShiftEnterComplete={onShiftEnterComplete}
      setEditor={(editor: IStandaloneCodeEditor) => setEditor(pad.id, editor)}
    />
  );
};

/*
 * Helpers.
 */

function getPreviousPadContext(pads: readonly PadState[], index: number) {
  if (index === 0) {
    return undefined;
  }

  return pads[index - 1].context;
}

function renderPadTitle(index: number) {
  return `In[${index + 1}]`;
}
