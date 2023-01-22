export const NUMBER_OF_TRIES = 6;

export const COLORS = {
  light: {
    black: '#121214',
    darkgrey: '#3A3A3D',
    grey: '#818384',
    lightgrey: '#D7DADC',
    primary: '#538D4E',
    secondary: '#B59F3B',
  },
  dark: {
    black: '#121214',
    darkgrey: '#3A3A3D',
    grey: '#818384',
    lightgrey: '#D7DADC',
    primary: '#538D4E',
    secondary: '#B59F3B',
  },
} as const;

export const colorsToEmoji = {
  darkgrey: '⬛',
  primary: '🟩',
  secondary: '🟧',
} as const;

export const ENTER = 'ENTER';
export const CLEAR = 'CLEAR';

export const keys = [
  // ['á', 'ó', 'ı', 'ń', 'ú', 'ǵ'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', CLEAR],
] as const;
