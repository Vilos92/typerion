import {Global, css} from '@emotion/react';
import {ComponentType} from 'react';
import tw, {GlobalStyles as BaseStyles, theme} from 'twin.macro';

/*
 * Constants.
 */

const customStyles = css({
  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    ...tw`antialiased`
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
