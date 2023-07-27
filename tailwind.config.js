/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    debugScreens: {
      position: ['bottom', 'left'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // https://tailwindcss.com/docs/typography-plugin
    // require('prettier-plugin-tailwindcss'), // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
    require('tailwindcss-debug-screens'), // https://github.com/jorenvanhee/tailwindcss-debug-screens
  ],
}

