import {Button as ButtonCmp} from './components/Button';
import {Pad as PadCmp} from './components/Pad';
import {withBaseStyles} from './helpers/twin';

const Button = withBaseStyles(ButtonCmp);
const Pad = withBaseStyles(PadCmp);

export {Button, Pad};
