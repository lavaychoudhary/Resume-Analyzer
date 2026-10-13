/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Strict Palette: White, Beige, and Green
        beige: {
          25:  '#FCFAF7',
          50:  '#F9F7F2',
          100: '#F3EFE6',
          150: '#ECE6D9',
          200: '#E4DDCF',
          300: '#D3C9B6',
          400: '#BDB19B',
          500: '#9E927C',
          800: '#453E32',
          900: '#2A251E',
        },
        cream: {
          50:  '#F9F7F2',
          100: '#F3EFE6',
          200: '#E4DDCF',
          300: '#D3C9B6',
        },
        green: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        ink: {
          DEFAULT: '#111111',
          light:   '#2C2A29',
          muted:   '#5C5850',
          faint:   '#8C867B',
        },
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(42, 37, 30, 0.05), 0 4px 16px rgba(42, 37, 30, 0.04)",
        'card-hover': "0 6px 24px rgba(42, 37, 30, 0.08)",
        green: "0 4px 16px rgba(22, 163, 74, 0.25)",
        'green-lg': "0 8px 30px rgba(22, 163, 74, 0.35)",
      },
      keyframes: {
        scanline: {
          "0%":   { top: "0%" },
          "100%": { top: "100%" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.85", transform: "scale(1.02)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        scanline:   "scanline 2s ease-in-out infinite alternate",
        pulseSlow:  "pulseSlow 3s ease-in-out infinite",
        fadeUp:     "fadeUp 0.4s ease-out forwards",
        fadeIn:     "fadeIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
