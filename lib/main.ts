import {Pad as PadCmp} from './components/Pad';
import {Notebook as NotebookCmp} from './components/Notebook';
import {withBaseStyles} from './helpers/twin';

const Pad = withBaseStyles(PadCmp);
const Notebook = withBaseStyles(NotebookCmp);

export {Pad, Notebook};
