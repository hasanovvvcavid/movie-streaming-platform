import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://project-6-55n3.onrender.com",
    },
  },
});
