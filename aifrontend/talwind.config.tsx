import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {

      keyframes: {
        'wave-hand': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(30px) rotate(-10deg)' },
          '40%': { transform: 'translateX(-30px) rotate(10deg)' },
          '60%': { transform: 'translateX(30px) rotate(-10deg)' },
          '80%': { transform: 'translateX(-30px) rotate(10deg)' },
        },
      },
      animation: {
        'wave-hand': 'wave-hand 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
