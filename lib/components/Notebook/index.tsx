import {FC, MouseEventHandler} from 'react';
import tw, {styled} from 'twin.macro';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';

import {AsyncStatusesEnum, Handler, IStandaloneCodeEditor, VmContext} from '../../types';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {Pad} from '../Pad';

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
 * Types.
 */

type Pad = {
  id: string;
  context?: VmContext;
  editor?: IStandaloneCodeEditor;
};

/*
 * State.
 */

type NotebookStateAttributes = {
  runStatus: AsyncStatusesEnum;
  focusedPadId?: string;
  pads: readonly Pad[];
};

type NotebookStateHandlers = {
  run: Handler;
  stop: Handler;
  updatePad: (id: string, pad: Pad) => void;
  focusPad: (id: string) => void;
  blurPad: (id: string) => void;
  insertPadBefore: (id: string, pad: Pad) => void;
  insertPadAfter: (id: string, pad: Pad) => void;
  setEditor: (id: string, editor: IStandaloneCodeEditor) => void;
};

type NotebookState = NotebookStateAttributes & NotebookStateHandlers;

const useNotebookStore = create<NotebookState>(set => ({
  runStatus: AsyncStatusesEnum.IDLE,
  focusedPadId: undefined,
  pads: [
    {
      id: uuidv4()
    }
  ],
  run: () => {
    set(state => {
      return {...state, runStatus: AsyncStatusesEnum.LOADING};
    });
  },
  stop: () => {
    set(state => {
      return {...state, runStatus: AsyncStatusesEnum.IDLE};
    });
  },
  updatePad: (id, pad) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPads = [...state.pads.slice(0, index), pad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  },
  focusPad: id => {
    set(state => {
      return {...state, focusedPadId: id};
    });
  },
  blurPad: id => {
    set(state => {
      if (state.focusedPadId !== id) {
        return state;
      }

      return {...state, focusedPadId: undefined};
    });
  },
  insertPadBefore: (id, pad) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPads = [...state.pads.slice(0, index), pad, ...state.pads.slice(index)];

      return {...state, pads: updatedPads};
    });
  },
  insertPadAfter: (id, pad) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPads = [...state.pads.slice(0, index + 1), pad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  },
  setEditor: (id, editor: IStandaloneCodeEditor) => {
    set(state => {
      const index = state.pads.findIndex(pad => pad.id === id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${id}`);
      }

      const updatedPad = {...state.pads[index], editor};

      const updatedPads = [...state.pads.slice(0, index), updatedPad, ...state.pads.slice(index + 1)];

      return {...state, pads: updatedPads};
    });
  }
}));

/*
 * Component.
 */

export const Notebook = () => {
  const {runStatus, focusedPadId, pads, run, stop, insertPadBefore, insertPadAfter} = useNotebookStore();

  const onInsertPadBeforeMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    insertPadBefore(focusedPadId, {id: uuidv4()});

    event.currentTarget.focus();
    event.currentTarget.blur();
  };

  const onInsertPadAfterMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    insertPadAfter(focusedPadId, {id: uuidv4()});

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

  const isAddButtonsDisabled = !focusedPadId;

  return (
    <StyledMain>
      <StyledTopDiv>
        {renderAddButtons(isAddButtonsDisabled, onInsertPadBeforeMouseDown, onInsertPadAfterMouseDown)}
        {renderPlayPauseButton(runStatus, onRunPauseClick)}
      </StyledTopDiv>
      <StyledNotebookDiv>
        {pads.map((pad, index) => (
          <NotebookPad key={pad.id} index={index} insertPadAfter={insertPadAfter} />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};

const NotebookPad: FC<{
  index: number;
  insertPadAfter: (id: string, pad: Pad) => void;
}> = ({index, insertPadAfter}) => {
  const {runStatus, focusedPadId, pads, updatePad, focusPad, blurPad, setEditor} = useNotebookStore();

  const pad = pads[index];

  const onPadFocus = (id: string) => {
    focusPad(id);
  };

  const onPadBlur = (id: string) => {
    blurPad(id);
  };

  const onRunComplete = (context: VmContext) => {
    updatePad(pad.id, {id: pad.id, context});
  };

  const onShiftEnterComplete = () => {
    if (index === pads.length - 1) {
      insertPadAfter(pad.id, {id: uuidv4()});
    }

    pads[index + 1]?.editor?.focus();
  };

  return (
    <Pad
      key={pad.id}
      title={renderPadTitle(index)}
      context={getPreviousPadContext(pads, index)}
      shouldAutoRun={
        runStatus === AsyncStatusesEnum.LOADING &&
        (index === 0 || Boolean(getPreviousPadContext(pads, index)))
      }
      hasFocus={focusedPadId === pad.id}
      onFocus={() => onPadFocus(pad.id)}
      onBlur={() => onPadBlur(pad.id)}
      onRunComplete={onRunComplete}
      onShiftEnterComplete={onShiftEnterComplete}
      setEditor={(editor: IStandaloneCodeEditor) => setEditor(pad.id, editor)}
    />
  );
};

/*
 * Helpers.
 */

function getPreviousPadContext(pads: readonly Pad[], index: number) {
  if (index === 0) {
    return undefined;
  }

  return pads[index - 1].context;
}

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

function renderPadTitle(index: number) {
  return `In[${index + 1}]`;
}
