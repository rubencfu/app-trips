/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#10a1b3',
        'primary-hover': '#0a8e9f',
        'primary-opacity': '#00bcd41f',
        disabled: '#65656554',
      },
    },
  },
  plugins: [],
};
