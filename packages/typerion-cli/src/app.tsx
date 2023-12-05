import {type FC} from 'react';
import ReactDOM from 'react-dom';
import {Notebook} from 'typerion';

const App: FC = () => {
  return <Notebook />;
};

ReactDOM.render(<App />, document.getElementById('root'));
