import {useEffect, useState} from 'react';

/*
 * Enums.
 */

export enum ColorSchemesEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

/*
 * Hooks.
 */

export function usePrefersColorScheme(): ColorSchemesEnum {
  const [colorScheme, setColorScheme] = useState<ColorSchemesEnum>(computeDefaultColorScheme());

  const onPrefersColorChangeHandler = (event: MediaQueryListEvent) => {
    const scheme = event.matches ? ColorSchemesEnum.DARK : ColorSchemesEnum.LIGHT;
    setColorScheme(scheme);
  };

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onPrefersColorChangeHandler);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onPrefersColorChangeHandler);
    };
  }, []);

  return colorScheme;
}

/*
 * Helpers.
 */

function computeDefaultColorScheme(): ColorSchemesEnum {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ColorSchemesEnum.DARK
    : ColorSchemesEnum.LIGHT;
}
