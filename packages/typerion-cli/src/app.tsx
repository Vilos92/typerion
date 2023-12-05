import {type FC} from 'react';
import {createRoot} from 'react-dom/client';
import {Notebook} from 'typerion';

const App: FC = () => {
  return <Notebook />;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
