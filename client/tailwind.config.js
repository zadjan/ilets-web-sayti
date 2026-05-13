/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        merri: ['Merriweather', 'serif'],
        lora: ['Lora', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        fire: {
          red: '#FF4500',
          orange: '#FF8C00',
          dark: '#1a0500',
        },
        water: {
          deep: '#0A1628',
          blue: '#1E90FF',
          light: '#87CEEB',
        },
        air: {
          sky: '#E8F4FD',
          white: '#FFFFFF',
          dark: '#1A3A5C',
        },
        earth: {
          green: '#2D5016',
          brown: '#8B7355',
          cream: '#F5F0E8',
        },
      },
      animation: {
        'flame': 'flame 2s ease-in-out infinite alternate',
        'wave': 'wave 4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scaleY(1) scaleX(1)', filter: 'brightness(1)' },
          '100%': { transform: 'scaleY(1.1) scaleX(0.95)', filter: 'brightness(1.2)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
