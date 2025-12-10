/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5', // ваш основной фиолетовый
          600: '#4338CA', // темнее для ховера
        }
      }
    },
  },
  plugins: [],
}