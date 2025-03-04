/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      backgroundImage: {
        'auth-bg': "url('./src/images/concordia.jpg')",
        'logo-bg': "url('./src/images/concordialogo.png')" 
      },
    },
  },
  plugins: [],
};

