/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Custom breakpoints for all device sizes
    screens: {
      'xs': '375px',    // Small phones
      'sm': '640px',    // Large phones / Small tablets
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops / Small desktops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
      '3xl': '1920px',  // Full HD monitors
      '4xl': '2560px',  // QHD/4K monitors
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // Fluid typography scale
      fontSize: {
        'fluid-xs': 'clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 0.65rem + 0.5vw, 0.875rem)',
        'fluid-base': 'clamp(0.875rem, 0.75rem + 0.5vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 0.875rem + 0.5vw, 1.125rem)',
        'fluid-xl': 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)',
        'fluid-2xl': 'clamp(1.25rem, 1rem + 1vw, 1.5rem)',
        'fluid-3xl': 'clamp(1.5rem, 1.25rem + 1vw, 1.875rem)',
      },
      // Fluid spacing
      spacing: {
        'fluid-1': 'clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem)',
        'fluid-2': 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
        'fluid-3': 'clamp(0.75rem, 0.6rem + 0.75vw, 1rem)',
        'fluid-4': 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
        'fluid-6': 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)',
        'fluid-8': 'clamp(2rem, 1.6rem + 2vw, 3rem)',
      },
    },
  },
  plugins: [],
};