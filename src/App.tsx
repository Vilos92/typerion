import {Notebook} from '../lib/components/Notebook';
import tw from 'twin.macro';

/*
 * Styles.
 */

const StyledColumnDiv = tw.div`mt-4 flex flex-col items-center`;

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
