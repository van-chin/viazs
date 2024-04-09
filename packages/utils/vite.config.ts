import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: "./index.ts",
      name: "utils",
    },
  },
  resolve: {
    dedupe: ["vue"],
    alias: [
      {
        find: /^viaz$/,
        replacement: resolve(__dirname, "..", "viaz", "index.ts"),
      },
      {
        find: /^@viaz\/(.*)$/,
        replacement: resolve(__dirname, "..", "$1", "index.ts"),
      },
    ],
  },
});
