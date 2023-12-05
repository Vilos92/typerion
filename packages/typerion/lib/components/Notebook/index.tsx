import tw from 'twin.macro';

import {useNotebookStore} from '../../store/store';
import {NotebookPad} from './NotebookPad';
import {NotebookTop} from './NotebookTop';

/*
 * Styles.
 */

const StyledMain = tw.main`relative max-w-screen-lg text-left w-[50%] min-w-[320px]`;

const StyledNotebookDiv = tw.div`mt-4 flex flex-col gap-4`;

/*
 * Component.
 */

export const Notebook = () => {
  const state = useNotebookStore();
  const {pads} = state;

  return (
    <StyledMain>
      <NotebookTop />
      <StyledNotebookDiv>
        {pads.map((pad, index) => (
          <NotebookPad key={pad.id} index={index} />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};
