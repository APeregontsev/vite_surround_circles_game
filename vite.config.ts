import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/vite_surround_circles_game",
  resolve: {
    alias: {
      src: "/src",
    },
  },
  publicDir: "./public",
});
