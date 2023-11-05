import {Pad} from '../lib/components/Pad';
import tw from 'twin.macro';

/*
 * Styles.
 */

const StyledColumnDiv = tw.div`flex flex-col items-center`;

const StyledNotebookDiv = tw.div`max-w-screen-lg min-w-[50%]`;

/*
 * Component.
 */

function App() {
  return (
    <StyledColumnDiv>
      <StyledNotebookDiv>
        <Pad />
      </StyledNotebookDiv>
    </StyledColumnDiv>
  );
}

export default App;
