/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0A0E1A',
          card: '#141828',
          hover: '#1A1F2E',
        },
        border: {
          DEFAULT: '#1F2433',
          light: '#2A3142',
        },
        accent: {
          DEFAULT: '#6C5CE7',
          hover: '#5849D6',
          light: '#8579EF',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92A7',
          muted: '#5C6478',
        },
        success: '#00D4AA',
        warning: '#FFB84D',
        danger: '#FF5C5C',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
