/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        card: "rgba(15, 23, 42, 0.75)",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        sentinelCyan: "#06b6d4",
        sentinelViolet: "#8b5cf6",
        sentinelEmerald: "#10b981",
        sentinelRose: "#f43f5e",
        sentinelAmber: "#f59e0b",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
