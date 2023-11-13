import tw from 'twin.macro';
import {Pad} from '../Pad';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';
import {IconTypesEnum} from '../Icon/types';
import {Icon} from '../Icon';
import {AsyncStatusesEnum, Handler} from '../../types';

/*
 * Styles.
 */

const StyledMain = tw.main`relative max-w-screen-lg text-left w-[50%] min-w-[320px]`;

// Top bar that is fixed to the top of the screen
const StyledTopDiv = tw.div`fixed z-10 flex h-12 flex-row items-center justify-between bg-stone-700 px-4 w-[50%] min-w-[320px]`;

const StyledButtonGroup = tw.div`flex flex-row items-center`;

const StyledIconButton = tw.button`flex items-center justify-center rounded p-2 hover:bg-stone-500`;

const StyledPlusIcon = tw(Icon)`text-stone-500`;

const StyledPlayButton = tw(StyledIconButton)`hover:text-emerald-600`;

const StyledPauseButton = tw(StyledIconButton)`text-emerald-600 hover:text-fuchsia-600`;

const StyledNotebookDiv = tw.div`mt-16 flex flex-col gap-4`;

/*
 * Types.
 */

type Pad = {
  id: string;
};

type NotebookState = {
  runStatus: AsyncStatusesEnum;
  focusedPadId: string | undefined;
  pads: readonly Pad[];
};

/*
 * State.
 */

const initialNotebookState: NotebookState = Object.freeze({
  runStatus: AsyncStatusesEnum.IDLE,
  focusedPadId: undefined,
  pads: [
    {
      id: uuidv4()
    }
  ]
});

const notebookSlice = createSlice({
  name: 'notebook',
  initialState: initialNotebookState,
  reducers: {
    run: state => {
      state.runStatus = AsyncStatusesEnum.LOADING;
    },
    stop: state => {
      state.runStatus = AsyncStatusesEnum.IDLE;
    },
    focusPad: (state, action: PayloadAction<string>) => {
      state.focusedPadId = action.payload;
    },
    blurPad: (state, action: PayloadAction<string>) => {
      if (state.focusedPadId === action.payload) {
        state.focusedPadId = undefined;
      }
    },
    pushPad: (state, action: PayloadAction<Pad>) => {
      state.pads.push(action.payload);
    }
  }
});

const notebookReducer = notebookSlice.reducer;
const notebookActions = notebookSlice.actions;

/*
 * Component.
 */

export const Notebook = () => {
  // Pass context through to each next pad.
  // For each Pad, pass a ref through to the next Pad.
  // - Can use one useRef, pass to both in different props, one assigns next one reads
  // If running whole notebook, only run one pad at a time.
  // Pads can auto-run because the above pad has passed context, and current pad is empty, and "should run" is true.
  // - Derive state, don't run a bunch of useEffects.

  const [{runStatus, focusedPadId, pads}, dispatch] = useReducer(notebookReducer, initialNotebookState);

  const onAddClick = () => {
    dispatch(notebookActions.pushPad({id: uuidv4()}));
  };

  const onRunPauseClick = () => {
    if (runStatus === AsyncStatusesEnum.IDLE) {
      dispatch(notebookActions.run());
      return;
    }

    dispatch(notebookActions.stop());
  };

  const onPadFocus = (id: string) => {
    dispatch(notebookActions.focusPad(id));
  };

  const onPadBlur = (id: string) => {
    dispatch(notebookActions.blurPad(id));
  };

  return (
    <StyledMain>
      <StyledTopDiv>
        {renderAddButtons(onAddClick)}
        {renderPlayPauseButton(runStatus, onRunPauseClick)}
      </StyledTopDiv>
      <StyledNotebookDiv>
        {pads.map((pad, index) => (
          <Pad
            key={pad.id}
            title={renderPadTitle(index)}
            hasFocus={focusedPadId === pad.id}
            onFocus={() => onPadFocus(pad.id)}
            onBlur={() => onPadBlur(pad.id)}
          />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};

/*
 * Helpers.
 */

function renderAddButtons(onAddClick: Handler) {
  return (
    <StyledButtonGroup>
      <StyledIconButton onClick={onAddClick}>
        <Icon type={IconTypesEnum.ARROW_ELBOW_LEFT_UP} size={32} />
      </StyledIconButton>
      <StyledPlusIcon type={IconTypesEnum.PLUS} size={32} />
      <StyledIconButton onClick={onAddClick}>
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
