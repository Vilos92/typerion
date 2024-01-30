import {type FC, useEffect} from 'react';
import tw from 'twin.macro';

import {useNotebookStore} from '../../store/store';
import type {Typnb} from '../../typnb';
import {NotebookPad} from './NotebookPad';
import {NotebookTop} from './NotebookTop';

/*
 * Types.
 */

type NotebookProps = {
  typnb?: Typnb;
  onShare?: (state: Typnb) => void;
};

/*
 * Styles.
 */

const StyledMain = tw.main`relative max-w-screen-lg text-left w-[50%] min-w-[320px]`;

const StyledNotebookDiv = tw.div`mt-4 flex flex-col gap-4`;

/*
 * Component.
 */

export const Notebook: FC<NotebookProps> = ({typnb, onShare}) => {
  const state = useNotebookStore();
  const {pads, load} = state;

  useEffect(() => {
    if (typnb) {
      load(typnb);
    }
  }, [load, typnb]);

  return (
    <StyledMain>
      <NotebookTop onShare={onShare} />
      <StyledNotebookDiv>
        {pads.map((pad, index) => (
          <NotebookPad key={pad.id} index={index} />
        ))}
      </StyledNotebookDiv>
    </StyledMain>
  );
};
