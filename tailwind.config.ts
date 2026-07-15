import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        panel: '#131c31',
        edge: '#26314f',
        accent: '#7c3aed',
        mint: '#10b981'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(0,0,0,0.18)'
      }
    }
  },
  plugins: []
};

export default config;
