// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        rs: {
          bg: "#0B0B0F",
          panel: "rgba(17,17,24,0.72)",
          border: "rgba(255,255,255,0.08)",
          text: "rgba(255,255,255,0.92)",
          muted: "rgba(255,255,255,0.62)",
          accent: "#FF6600",
          accent2: "#5B6CFF",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        rs: "0 16px 55px rgba(0,0,0,0.62)",
        "rs-glow": "0 18px 55px rgba(255,102,0,0.18)",
      },
    },
  },
  plugins: [],
}
