import {style} from '@vanilla-extract/css';

/*
 * Styles.
 */

export const notebookPageDivStyle = style({
  width: '100%'
});

export const notebookDetailsSidebarDivStyle = style({
  position: 'absolute'
});

export const notebookDetailsDivStyle = style({
  background: '#44403c',
  color: '#ffffff',

  padding: '12px 0 12px 0',

  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

export const notebookDetailsItemDivStyle = style({
  padding: '0 12px 0 12px',

  ':hover': {
    backgroundColor: '#666666'
  }
});

export const notebookDivStyle = style({
  width: '100%',

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
