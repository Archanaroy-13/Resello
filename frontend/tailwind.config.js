/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F2',
          100: '#E6EDE0',
          200: '#D0DEC5',
          300: '#B2C9A3',
          400: '#9CB78B',
          500: '#87A96B', // Primary Sage Green
          600: '#6B8E50',
          700: '#526F3D',
          800: '#415832',
          900: '#344729',
        },
        forest: {
          50: '#F0F7F0',
          100: '#DCEDDC',
          500: '#4A7C49',
          700: '#2D5A27',
          800: '#1E3F1A', // Accent Forest Green
          900: '#132A11',
        },
        surface: '#F9FAFB'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
