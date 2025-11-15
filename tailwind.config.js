/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,ts}",
];
export const darkMode = 'class';
export const theme = {
  extend: {
    colors: {
      primary: {
        0: '#008071',
        1: '#258073',
        2: '#378174',
        3: '#448176',
        4: '#508178',
        5: '#5b8179',
      },
      secondary: {
        0: '#eeeeee',
        1: '#dddddd',
        2: '#cccccc',
        3: '#bbbbbb',
        4: '#aaaaaa',
        5: '#999999',
      },
      light: {
        0: '#ffffff',
        1: '#eeeeee',
        2: '#dddddd',
        3: '#cccccc',
        4: '#bbbbbb',
        5: '#aaaaaa',
      },
      dark: {
        0: '#111111',
        1: '#222222',
        2: '#333333',
        3: '#444444',
        4: '#555555',
        5: '#666666',
      },
      status: {
        info: '#427bb1',
        'info-light': '#5cbad1',
        'info-dark': '#1b2e83',
        success: '#008071',
        'success-light': '#8cb6ae',
        'success-dark': '#00493e',
        warning: '#f39c12',
        'warning-light': '#cab99e',
        'warning-dark': '#664b00',
        error: '#870b25',
        'error-light': '#c58e9a',
        'error-dark': '#740926',
        disabled: '#444444',
        'disabled-light': '#aaaaaa',
        'disabled-dark': '#111111',
      }
    },
  },
};
export const plugins = [];
