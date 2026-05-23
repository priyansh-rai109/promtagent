/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050816",
          blue: "#00D9FF",
          purple: "#A855F7",
          pink: "#FF00FF",
          cyan: "#00F5FF",
        }
      },
      fontFamily: {
        cyber: ["Orbitron", "sans-serif"],
        hud: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 217, 255, 0.25), inset 0 0 10px rgba(0, 217, 255, 0.1)",
        "neon-purple": "0 0 15px rgba(168, 85, 247, 0.25), inset 0 0 10px rgba(168, 85, 247, 0.1)",
        "neon-pink": "0 0 15px rgba(255, 0, 255, 0.25), inset 0 0 10px rgba(255, 0, 255, 0.1)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 217, 255, 0.05)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse': 'spin-reverse 22s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
