/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Replace with actual logo primary color
        primary: {
          DEFAULT: '#0A5F3A',
          600: '#0D6B42',
          700: '#084D30',
        },
        // Accent - Replace with actual logo accent color
        accent: {
          DEFAULT: '#FFD166',
          dark: '#F4A460',
        },
        // Semantic
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '12px',
        lg: '18px',
        xl: '24px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
    },
  },
  plugins: [],
};
