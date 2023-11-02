import {Button as ButtonCmp} from './components/Button';
import {withGlobalStyles} from './helpers/twin';

export function helloAnything(thing: string): string {
  return `Hello ${thing}!`;
}

const Button = withGlobalStyles(ButtonCmp);
export {Button};
