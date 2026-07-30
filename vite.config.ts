import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/sus-viz/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
