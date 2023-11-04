import viteLogo from '/vite.svg';
import {Pad} from '../lib/components/Pad';
import {styled} from 'twin.macro';

/*
 * Styles.
 */

const StyledLogoImg = styled.img`
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;

  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
`;

/*
 * Component.
 */

function App() {
  return (
    <>
      <a href="https://vitejs.dev" target="_blank">
        <StyledLogoImg src={viteLogo} alt="Vite logo" />
      </a>
      <Pad />
    </>
  );
}

export default App;
