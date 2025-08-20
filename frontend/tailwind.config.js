/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
        spartan: ["'League Spartan', sans-serif"],
      },
      colors: {
        text: 'black',
        dialogBg: '#392c3b7a',
        bgSelected: '#4a384d',
        primary: {
          dark: '#231526',
          light: '#392C3B',
        },
        secondary: {
          base: '#FF9155',
          gradient: {
            from: '#FB923C',
            to: '#F87171',
          },
        },
        dark: '#222222',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
        circularMove: {
          '0%': {
            transform: 'rotate(0deg) translateX(2px) rotate(0deg);',
          },
          '100%': {
            transform: 'rotate(360deg) translateX(2px) rotate(-360deg);',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
        slidInBottom: {
          '0%': {
            transform: 'translateY(0);',
            visibility: 'hidden',
          },
          '80%': {
            transform: 'translateY(-44px);',
            visibility: 'initial',
          },
          '90%': {
            transform: 'translateY(-42px);',
            visibility: 'initial',
          },
          '100%': {
            transform: 'translateY(-38px);',
            visibility: 'initial',
          },
        },
        slidOutBottom: {
          '0%': {
            transform: 'translateY(-40px);',
            visibility: 'initial',
          },
          '100%': {
            transform: 'translateY(0px);',
            visibility: 'hidden',
            opacity: 0,
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        slidInBottom: 'slidInBottom 1s ease-in',
        slidOutBottom: 'slidOutBottom 1s ease-in-out',
        circularMove: 'circularMove 4s linear infinite',
      },
      screens: {
        xs: { min: '0px', max: '400px' },
        downXs: { max: '400px' },

        sm: { min: '400px', max: '767px' },
        upSm: { min: '400px' },
        downSm: { max: '767px' },

        md: { min: '768px', max: '1023px' },
        upMd: { min: '768px' },
        downMd: { max: '1023px' },

        lg: { min: '1024px', max: '1279px' },
        upLg: { min: '1024px' },
        downLg: { max: '1279px' },

        xl: { min: '1280px', max: '1400px' },
        upXl: { min: '1280px' },
        downXl: { max: '1400px' },

        '2xl': { min: '1401px', max: '1500px' },
        up2Xl: { min: '1401px' },
        down2Xl: { max: '1500px' },

        '3xl': { min: '1501px', max: '1600px' },
        up3xl: { min: '1501px' },
        down3Xl: { max: '1600px' },

        '4xl': { min: '1601px', max: '1800px' },
        up4xl: { min: '1601px' },

        '5xl': { min: '1801px', max: '2000px' },
        up5xl: { min: '1801px' },

        '6xl': { min: '2000px' },
      },
    },
  },
};
