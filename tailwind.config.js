/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FDFBF7',
          100: '#F5F2EB',
          200: '#EBE5D9',
          300: '#DED5C3',
        },
        espresso: {
          DEFAULT: '#2D2422',
          light: '#4A3E3C',
          muted: '#8A7B78',
        },
        navy: {
          DEFAULT: '#1A2B4C',
          light: '#2A406B',
          soft: '#EAF0F8',
        },
        terracotta: {
          DEFAULT: '#E07A5F',
          soft: '#FDECE8',
        },
        emerald: {
          DEFAULT: '#2E8B57',
          soft: '#E8F5EE',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#FBF8E6',
        },
        rose: {
          DEFAULT: '#E57373',
          soft: '#FCECEC',
        }
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(45, 36, 34, 0.04)",
        glow: "0 0 20px rgba(26, 43, 76, 0.15)",
        'glow-terracotta': "0 0 20px rgba(224, 122, 95, 0.2)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        }
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease-out forwards",
        fadeIn: "fadeIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
