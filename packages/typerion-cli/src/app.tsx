import {type FC} from 'react';
import {createRoot} from 'react-dom/client';
import {Notebook} from 'typerion';

/*
 * Styles.
 */

// style for the column that centers the notebook.
const columnStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px'
};

/*
 * Component.
 */

const App: FC = () => {
  return (
    <div style={columnStyle}>
      <Notebook />
    </div>
  );
};

/*
 * Render app.
 */

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
