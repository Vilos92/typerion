import {Button as ButtonCmp} from './components/Button';
import {Pad as PadCmp} from './components/Pad';
import {withBaseStyles} from './helpers/twin';

export function helloAnything(thing: string): string {
  return `Hello ${thing}!`;
}

const Button = withBaseStyles(ButtonCmp);
const Pad = withBaseStyles(PadCmp);

export {Button, Pad};
