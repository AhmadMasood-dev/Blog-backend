
/** @type {import('tailwindcss').Config} */
 export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#edae49",
        secondary: "#e8dab2",
        accent: "#092327",
      },
    },
  },
  plugins: [],
};
