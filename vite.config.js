import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import process from "node:process";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const localCertificatePath = path.resolve(dirname, "moa-ssl.p12");
const localCertificatePassphrase = process.env.MOA_DEV_HTTPS_PASSPHRASE;
const localHttps =
  fs.existsSync(localCertificatePath) && localCertificatePassphrase
    ? {
        pfx: fs.readFileSync(localCertificatePath),
        passphrase: localCertificatePassphrase,
      }
    : undefined;

export default defineConfig({
  root: dirname,
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
    https: localHttps,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,

        rewrite: (path) => {
          return path;
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
