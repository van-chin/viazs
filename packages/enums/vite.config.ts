import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.ts",
      name: "enums",
      fileName: "enums",
    },
    minify: false,
    rollupOptions: {
      external: ["vue", /ant-design-vue.*/],
      output: {
        globals: {
          vue: "vue",
          "ant-design-vue": "antDesignVue",
          "ant-design-vue/es": "antDesignVueEs",
        },
      },
    },
  },
});
