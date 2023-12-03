import {saveAs} from 'file-saver';
import {type ChangeEvent, type MouseEventHandler, type RefObject, useEffect, useRef} from 'react';
import tw, {styled} from 'twin.macro';
import {v4 as uuidv4} from 'uuid';

import {type TypnbState, getTypnb} from '../../store/selectors';
import {useNotebookStore} from '../../store/store';
import {AsyncStatusesEnum, type Handler} from '../../types';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {NotebookPad} from './NotebookPad';

/*
 * Types.
 */

type StyledButtonGroupProps = {
  $isDisabled?: boolean;
};

/*
 * Styles.
 */

const StyledMain = tw.main`relative max-w-screen-lg text-left w-[50%] min-w-[320px]`;

const StyledTopDiv = tw.div`sticky z-10 flex h-12 flex-row items-center justify-between bg-stone-700 px-4`;

const StyledButtonGroup = styled.div<StyledButtonGroupProps>`
  ${({$isDisabled}) => {
    if ($isDisabled) {
      return tw`opacity-50`;
    }
  }}

  ${tw`flex flex-row items-center`}
`;

const StyledIconButton = tw.button`flex items-center justify-center rounded p-2 text-white hover:bg-stone-500`;

const StyledPlusIcon = tw(Icon)`text-stone-500`;

const StyledPlayButton = tw(StyledIconButton)`text-white hover:text-emerald-600`;

const StyledPauseButton = tw(StyledIconButton)`text-emerald-600 hover:text-fuchsia-600`;

const StyledNotebookDiv = tw.div`mt-4 flex flex-col gap-4`;

/*
 * Component.
 */

export const Notebook = () => {
  const state = useNotebookStore();
  const {runStatus, focusedPadId, pads, load, run, stop, insertPadBefore, insertPadAfter} = state;

  const onInsertPadBeforeMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    insertPadBefore(focusedPadId, {id: uuidv4(), code: ''});

    event.currentTarget.focus();
    event.currentTarget.blur();
  };

  const onInsertPadAfterMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    insertPadAfter(focusedPadId, {id: uuidv4(), code: ''});

    event.currentTarget.focus();
    event.currentTarget.blur();
  };

  const onRunPauseClick = () => {
    if (runStatus === AsyncStatusesEnum.IDLE) {
      run();
      return;
    }

    stop();
  };

  const onSaveClick = () => {
    const typnb = getTypnb(state);
    saveTypnbFile(typnb);
  };

  function onTypnbFileLoad(fileString: string) {
    const typnb = JSON.parse(fileString);
    load(typnb);
  }

  const isAddButtonsDisabled = !focusedPadId;

  return (
    <StyledMain>
      <StyledTopDiv>
        {renderAddButtons(isAddButtonsDisabled, onInsertPadBeforeMouseDown, onInsertPadAfterMouseDown)}
        {renderRightButtonGroup(runStatus, onRunPauseClick, onSaveClick, onTypnbFileLoad)}
      </StyledTopDiv>
      <StyledNotebookDiv>
        {pads.map((pad, index) => (
          <NotebookPad key={pad.id} index={index} insertPadAfter={insertPadAfter} />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};

/*
 * Helpers.
 */

function renderAddButtons(
  isDisabled: boolean,
  onInsertPadBeforeMouseDown: MouseEventHandler<HTMLButtonElement>,
  onInsertPadAfterMouseDown: MouseEventHandler<HTMLButtonElement>
) {
  return (
    <StyledButtonGroup $isDisabled={isDisabled}>
      <StyledIconButton onMouseDown={onInsertPadBeforeMouseDown}>
        <Icon type={IconTypesEnum.ARROW_ELBOW_LEFT_UP} size={32} />
      </StyledIconButton>
      <StyledPlusIcon type={IconTypesEnum.PLUS} size={32} />
      <StyledIconButton onMouseDown={onInsertPadAfterMouseDown}>
        <Icon type={IconTypesEnum.ARROW_ELBOW_RIGHT_DOWN} size={32} />
      </StyledIconButton>
    </StyledButtonGroup>
  );
}

function renderRightButtonGroup(
  runStatus: AsyncStatusesEnum,
  onPlayPauseClick: Handler,
  onSaveClick: Handler,
  onTypnbFileLoad: (fileString: string) => void
) {
  return (
    <StyledButtonGroup>
      <StyledIconButton>
        <Icon type={IconTypesEnum.FOLDER_OPEN} size={32} />
        <input
          type="file"
          accept="application/json"
          onChange={event =>
            handleFileInputEvent(event as unknown as ChangeEvent<HTMLInputElement>, onTypnbFileLoad)
          }
        />
      </StyledIconButton>
      <StyledIconButton onClick={onSaveClick}>
        <Icon type={IconTypesEnum.FLOPPY_DISK} size={32} />
      </StyledIconButton>
      {renderPlayPauseButton(runStatus, onPlayPauseClick)}
    </StyledButtonGroup>
  );
}

function renderPlayPauseButton(runStatus: AsyncStatusesEnum, onClick: Handler) {
  switch (runStatus) {
    case AsyncStatusesEnum.IDLE:
      return (
        <StyledPlayButton onClick={onClick}>
          <Icon type={IconTypesEnum.PLAY_CIRCLE} size={32} />
        </StyledPlayButton>
      );
    case AsyncStatusesEnum.LOADING:
      return (
        <StyledPauseButton onClick={onClick}>
          <Icon type={IconTypesEnum.PAUSE_CIRCLE} size={32} />
        </StyledPauseButton>
      );
    default:
      throw new Error(`Not a run status: ${runStatus}`);
  }
}

function saveTypnbFile(typnb: TypnbState) {
  const json = JSON.stringify(typnb);
  const blob = new Blob([json], {type: 'application/json;charset=utf-8'});
  saveAs(blob, 'typnb.json');
}

function handleFileInputEvent(
  event: ChangeEvent<HTMLInputElement>,
  onFileLoad: (fileString: string) => void
) {
  const file = event.currentTarget.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = event => {
    const file = event?.target?.result;
    if (!file) {
      return;
    }

    const fileString: string = typeof file === 'string' ? file : Buffer.from(file).toString();

    onFileLoad(fileString);
  };
  reader.readAsText(file);
}
