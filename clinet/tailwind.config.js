/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128': '52rem',
        '129': '35rem',
        '130': '25rem',
      },
      spacing:{
        1.2: "0.3rem",
        62.5: "15.625rem",
        63.5: "7rem",
        68.5: "17.125rem",
        'hh': "35rem",
        'navlg' : 'calc(100% - 18.125rem)',
        'navsm' : 'calc(100% - 8rem)'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'background': '#FFFFFF',
        // 'dark-background': '#272f3a',
        'dark-background': '#141414',
        // 'dark-second': '#1E293B',
        'dark-second': '#323232',
        'dark-third': '#323232',
        'primary': '#0085FF',
        'dark-primary': '#188FFF',
        'success': '#00BA34',
        'dark-success': '#17CB49',
        'warning': '#F98600',
        'dark-warning': '#FF9F2D',
        'error': '#E92C2C',
        'dark-error': '#F74141',
        'gray-color': '#d9dbde',
        'text': '#5A5B63',
        'text-color': '#5A5B63',
        'dark-text-color': '#c5c5c9',
      },
    },
  },
  plugins: [],
}