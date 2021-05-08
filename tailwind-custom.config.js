const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addComponents, theme }) {
      const buttons = {
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.600'),
        },
        '.btn-indigo': {
          backgroundColor: theme('colors.indigo.400'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.indigo.600'),
          },
        },
      };
      addComponents(buttons);
    }),
    plugin(function({ addComponents, theme }) {
      const buttons = {
        '.input': {
          padding: `${theme('spacing.2')} ${theme('spacing.1')}`,
          borderBottom: `solid 0.05rem`,
          borderColor: theme('colors.indigo.600'),
          marginBottom: '1rem',
          width: '100%',
          '&:placeholder': {
            color: theme('colors.coolGray.200'),
          },
          outlineStyle: 'none',
        },
      };
      addComponents(buttons);
    }),
  ],
};
