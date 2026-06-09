import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // country-state-city (~590 kB) and recharts (~543 kB) are split into async chunks.
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/country-state-city")) {
            return "country-state-city"
          }
          if (id.includes("/src/features/employees/data/locationData")) {
            return "location-data"
          }
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "recharts"
          }
          if (id.includes("node_modules/@tanstack/")) {
            return "tanstack"
          }
        },
      },
    },
  },
})
