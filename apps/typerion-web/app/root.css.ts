import {globalStyle} from '@vanilla-extract/css';

globalStyle(':root', {
  margin: 0,
  backgroundColor: '#242424',

  '@media': {
    '(prefers-color-scheme: light)': {
      backgroundColor: '#FFFFFF'
    }
  }
});
