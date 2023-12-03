import {saveAs} from 'file-saver';
import {type MouseEventHandler} from 'react';
import tw, {styled} from 'twin.macro';
import {v4 as uuidv4} from 'uuid';

import typerionIcon from '../../assets/typerionIcon.svg';
import typerionIconDark from '../../assets/typerionIconDark.svg';
import typerionLogoMark from '../../assets/typerionLogoMark.svg';
import typerionLogoMarkDark from '../../assets/typerionLogoMarkDark.svg';
import {getTypnb} from '../../store/selectors';
import {useNotebookStore} from '../../store/store';
import {AsyncStatusesEnum, type Handler} from '../../types';
import {type TypnbState, decodeTypnbState} from '../../typnb';
import {Icon} from '../Icon';
import {IconTypesEnum} from '../Icon/types';
import {NotebookPad} from './NotebookPad';
import {TypnbOpenButton} from './TypnbOpenButton';

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

const StyledTopDiv = styled.div`
  ${tw`sticky z-10 flex h-12 flex-row items-center justify-between bg-stone-300 px-4`};

  @media (prefers-color-scheme: dark) {
    ${tw`bg-stone-700`};
  }
`;

const StyledLogoImg = styled.img`
  ${tw`h-10`};

  @media (prefers-color-scheme: light) {
    &.logo-dark {
      ${tw`hidden`};
    }

    &.logo-mark-dark {
      ${tw`hidden`};
    }

    @media screen and (min-width: 1024px) {
      &.logo {
        ${tw`hidden`};
      }
    }

    @media screen and (max-width: 1024px) {
      &.logo-mark {
        ${tw`hidden`};
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    &.logo {
      ${tw`hidden`};
    }

    &.logo-mark {
      ${tw`hidden`};
    }

    @media screen and (min-width: 1024px) {
      &.logo-dark {
        ${tw`hidden`};
      }
    }

    @media screen and (max-width: 1024px) {
      &.logo-mark-dark {
        ${tw`hidden`};
      }
    }
  }
`;

const StyledButtonGroup = styled.div<StyledButtonGroupProps>`
  ${({$isDisabled}) => {
    if ($isDisabled) {
      return tw`opacity-50`;
    }
  }}

  ${tw`flex flex-row items-center`}
`;

const StyledIconButton = tw.button`flex items-center justify-center rounded p-2  text-black hover:text-white dark:text-white hover:bg-stone-500`;

const StyledPlusIcon = tw(Icon)`text-stone-500`;

const StyledPlayButton = tw(StyledIconButton)`text-black dark:text-white hover:text-emerald-600`;

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
    const typnbJson = JSON.parse(fileString);
    const typnbState = decodeTypnbState(typnbJson);
    load(typnbState);
  }

  const isAddButtonsDisabled = !focusedPadId;

  return (
    <StyledMain>
      <StyledTopDiv>
        {renderAddButtons(isAddButtonsDisabled, onInsertPadBeforeMouseDown, onInsertPadAfterMouseDown)}
        <StyledLogoImg className="logo" src={typerionIcon} alt="Typerion" />
        <StyledLogoImg className="logo-mark" src={typerionLogoMark} alt="Typerion" />
        <StyledLogoImg className="logo-dark" src={typerionIconDark} alt="Typerion" />
        <StyledLogoImg className="logo-mark-dark" src={typerionLogoMarkDark} alt="Typerion" />
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
      <TypnbOpenButton onTypnbFileLoad={onTypnbFileLoad} />
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
