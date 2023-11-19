import tw, {styled} from 'twin.macro';
import {Pad} from '../Pad';
import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FC, MouseEventHandler} from 'react';
import {v4 as uuidv4} from 'uuid';
import {IconTypesEnum} from '../Icon/types';
import {Icon} from '../Icon';
import {AsyncStatusesEnum, Handler, VmContext} from '../../types';
import {useDispatch, useSelector, TypedUseSelectorHook, Provider} from 'react-redux';

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
};

type NotebookState = {
  runStatus: AsyncStatusesEnum;
  focusedPadId?: string;
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
    updatePad: (state, action: PayloadAction<{id: string; pad: Pad}>) => {
      const index = state.pads.findIndex(pad => pad.id === action.payload.id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${action.payload.id}`);
      }

      state.pads[index] = action.payload.pad;
    },
    focusPad: (state, action: PayloadAction<string>) => {
      state.focusedPadId = action.payload;
    },
    blurPad: (state, action: PayloadAction<string>) => {
      if (state.focusedPadId === action.payload) {
        state.focusedPadId = undefined;
      }
    },
    insertPadBefore: (state, action: PayloadAction<{id: string; pad: Pad}>) => {
      const index = state.pads.findIndex(pad => pad.id === action.payload.id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${action.payload.id}`);
      }

      state.pads.splice(index, 0, action.payload.pad);
    },
    insertPadAfter(state, action: PayloadAction<{id: string; pad: Pad}>) {
      const index = state.pads.findIndex(pad => pad.id === action.payload.id);

      if (index === -1) {
        throw new Error(`Could not find pad with id ${action.payload.id}`);
      }

      state.pads.splice(index + 1, 0, action.payload.pad);
    }
  }
});

const notebookReducer = notebookSlice.reducer;
const notebookActions = notebookSlice.actions;

const store = configureStore({
  reducer: notebookReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Allow VmContext to have non-serializable values passed through.
        ignoredActionPaths: ['payload.pad.context']
      }
    })
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const getRunStatus = (state: RootState) => state.runStatus;
const getFocusedPadId = (state: RootState) => state.focusedPadId;
const getPads = (state: RootState) => state.pads;

/*
 * Component.
 */

export const Notebook: FC = () => (
  <Provider store={store}>
    <NotebookInternal />
  </Provider>
);

const NotebookInternal = () => {
  const dispatch = useAppDispatch();

  const runStatus = useAppSelector(getRunStatus);
  const focusedPadId = useAppSelector(getFocusedPadId);
  const pads = useAppSelector(getPads);

  const onInsertPadBeforeMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    dispatch(notebookActions.insertPadBefore({id: focusedPadId, pad: {id: uuidv4()}}));

    event.currentTarget.focus();
    event.currentTarget.blur();
  };

  const onInsertPadAfterMouseDown: MouseEventHandler<HTMLButtonElement> = event => {
    if (!focusedPadId) {
      return;
    }

    event.preventDefault();

    dispatch(notebookActions.insertPadAfter({id: focusedPadId, pad: {id: uuidv4()}}));

    event.currentTarget.focus();
    event.currentTarget.blur();
  };

  const onRunPauseClick = () => {
    if (runStatus === AsyncStatusesEnum.IDLE) {
      dispatch(notebookActions.run());
      return;
    }

    dispatch(notebookActions.stop());
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
          <NotebookPad key={pad.id} index={index} />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};

const NotebookPad: FC<{
  index: number;
}> = ({index}) => {
  const dispatch = useAppDispatch();

  const runStatus = useAppSelector(getRunStatus);
  const focusedPadId = useAppSelector(getFocusedPadId);
  const pads = useAppSelector(getPads);

  const pad = pads[index];

  const onPadFocus = (id: string) => {
    dispatch(notebookActions.focusPad(id));
  };

  const onPadBlur = (id: string) => {
    dispatch(notebookActions.blurPad(id));
  };

  const onPadRunComplete = (id: string, context: VmContext) => {
    dispatch(notebookActions.updatePad({id, pad: {id, context}}));
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
      onPadRunComplete={context => onPadRunComplete(pad.id, context)}
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
