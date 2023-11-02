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

export function withGlobalStyles<P>(Component?: ComponentType<P>) {
  return (props: P) => (
    <>
      <BaseStyles />
      <Global styles={customStyles} />
      {Component && <Component key="component-with-global-styles" {...props} />}
    </>
  );
}
