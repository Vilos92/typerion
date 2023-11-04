import {Global, css} from '@emotion/react';
import {ComponentType} from 'react';
import tw, {GlobalStyles as BaseStyles, theme} from 'twin.macro';

/*
 * Constants.
 */

const customStyles = css({
  ':root': {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    lineHeight: '1.5',
    fontWeight: '400',

    colorScheme: 'light dark',
    color: 'rgba(255, 255, 255, 0.87)',
    backgroundColor: '#242424',

    fontSynthesis: 'none',
    textRendering: 'optimizeLegibility',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    '-webkit-text-size-adjust': '100%'
  },

  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    ...tw`m-0 flex min-h-screen place-items-center antialiased min-w-[320px]`
  },

  '@media (prefers-color-scheme: light)': {
    ':root': {
      color: '#213547',
      backgroundColor: '#ffffff'
    }
  }
});

/*
 * Helpers.
 */

export function withBaseStyles<P>(Component?: ComponentType<P>) {
  return (props: P) => (
    <>
      <BaseStyles />
      {Component && <Component key="component-with-base-styles" {...props} />}
    </>
  );
}

export function withGlobalStyles<P>(Component?: ComponentType<P>) {
  return (props: P) => (
    <>
      <Global styles={customStyles} />
      {withBaseStyles(Component)(props)}
    </>
  );
}
