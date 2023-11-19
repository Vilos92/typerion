import {Global, css} from '@emotion/react';
import {type ComponentType} from 'react';
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
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTextSizeAdjust: '100%'
  },

  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    ...tw`m-0 antialiased`
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
