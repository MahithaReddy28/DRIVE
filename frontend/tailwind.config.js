/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: "#0B0F19",
          card: "#111827",
          panel: "#1F2937",
          border: "#374151",
          text: "#F9FAFB",
          muted: "#9CA3AF"
        },
        aegis: {
          cyan: "#06B6D4",
          blue: "#3B82F6",
          red: "#EF4444",
          amber: "#F59E0B",
          green: "#10B981",
          purple: "#8B5CF6"
        }
      },
      boxShadow: {
        cyan: "0 0 20px rgba(6, 182, 212, 0.25)",
        red: "0 0 20px rgba(239, 68, 68, 0.25)",
        glow: "0 0 15px rgba(59, 130, 246, 0.3)"
      }
    },
  },
  plugins: [],
}
