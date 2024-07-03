/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        'border': '0 0 0 1px #000'
      },
      lineHeight:{
        '1': '1rem'
      }
    },
  },
  plugins: [],
}
