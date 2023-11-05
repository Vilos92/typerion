import tw from 'twin.macro';
import {Pad} from '../Pad';

/*
 * Styles.
 */

const StyledNotebookDiv = tw.div`max-w-screen-lg w-[50%] min-w-[320px]`;

/*
 * Component.
 */

export const Notebook = () => {
  return (
    <StyledNotebookDiv>
      <Pad />
    </StyledNotebookDiv>
  );
};
