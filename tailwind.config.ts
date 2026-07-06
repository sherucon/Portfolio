import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Zoop blue (primary)
        primary: '#1976FF',
        'primary-light': '#E3F2FD',
        // Inspired by umanodesign.studio orange accent
        accent: '#FF4405',
        'accent-hover': '#E53D04',
        // Neutral colors
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // We could add a premium serif font like "AM Le Cygne" later if we want to add custom fonts
        // serif: ['"AM Le Cygne"', 'Georgia', 'serif'],
      },
      boxShadow: {
        sm: '0px 1px 3px 0px rgba(10, 13, 18, 0.1), 0px 1px 2px 0px rgba(10, 13, 18, 0.06)',
        md: '0px 4px 8px -2px rgba(10, 13, 18, 0.1), 0px 2px 4px -2px rgba(10, 13, 18, 0.06)',
        lg: '0px 12px 16px 0px rgba(10, 13, 18, 0.08), 0px 4px 6px 0px rgba(10, 13, 18, 0.05), 0px 2px 2px 0px rgba(10, 13, 18, 0.06)',
        'skeuomorphic': '0px 1px 2px 0px rgba(10, 13, 18, 0.08), inset 0px -2px 0px 0px rgba(10, 13, 18, 0.08), inset 0px 0px 0px 1px rgba(10, 13, 18, 0.18)',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out',
        fadeInUp: 'fadeInUp 0.8s ease-out',
        fadeInDown: 'fadeInDown 0.8s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 0.5) infinite',
        float: 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;