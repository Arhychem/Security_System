/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./screens/StartScreen/**/*.{js,jsx,ts,tsx}",
    "./components1/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// tailwind.config.js

// module.exports = {
//   - content: [],
//   + content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }