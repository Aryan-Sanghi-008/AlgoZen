import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      "/api/leetcode-proxy": {
        target: "https://lccn.lbao.site/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leetcode-proxy/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
  base: "/",
});