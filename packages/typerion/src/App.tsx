import tw from 'twin.macro';

import {Notebook} from '../lib/components/Notebook';

/*
 * Styles.
 */

const StyledColumnDiv = tw.div`my-4 flex flex-col items-center`;

/*
 * Component.
 */

function App() {
  return (
    <StyledColumnDiv>
      <Notebook />
    </StyledColumnDiv>
  );
}

export default App;
