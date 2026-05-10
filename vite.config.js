import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          apexcharts: ["apexcharts", "react-apexcharts"],
          chartjs: ["chart.js", "react-chartjs-2"],
          recharts: ["recharts"],
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          motion: ["framer-motion"],
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },

  server: {
    host: true,
    https: {
      pfx: fs.readFileSync("./moa-ssl.p12"),
      passphrase: "moa1234",
    },

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,

        rewrite: (path) => {
          return path;
        },

        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });

          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request:", req.method, req.url);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received Response:", proxyRes.statusCode, req.url);
          });
        },
      },

      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
