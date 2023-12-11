import {style} from '@vanilla-extract/css';

/*
 * Styles.
 */

export const mainStyle = style({
  width: '100%',
  paddingTop: '16px',
  paddingBottom: '48px',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const bottomNavStyle = style({
  position: 'fixed',
  bottom: 0,
  left: 0,

  height: '32px',
  width: '100%',
  paddingRight: '16px',

  background: 'rgb(68 64 60)',
  color: '#FFFFFF',

  '@media': {
    '(prefers-color-scheme: light)': {
      backgroundColor: 'rgb(214 211 209)',
      color: '#000000'
    }
  },

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '16px'
});

export const bottomNavButtonStyle = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px'
});

export const logoImgStyle = style({
  height: '24px',
  width: 'auto'
});
