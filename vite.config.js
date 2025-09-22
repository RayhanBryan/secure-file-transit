import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  base: "/voltage-key-cache-dashboard/",
  server: {
    host: "0.0.0.0", // <-- allow external connections
    port: 5173, // optional, to ensure it's consistent
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
