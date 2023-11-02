import {Button as ButtonCmp} from './components/Button';
import {Pad as PadCmp} from './components/Pad';
import {withGlobalStyles} from './helpers/twin';

export function helloAnything(thing: string): string {
  return `Hello ${thing}!`;
}

const Button = withGlobalStyles(ButtonCmp);
const Pad = withGlobalStyles(PadCmp);

export {Button, Pad};
