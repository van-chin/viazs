import type { UserConfig, ConfigEnv, PluginOption } from "vite";
import { loadEnv } from "vite";
import { resolve } from "node:path";

import {
  configVitePlugins,
  getLessOptions,
  wrapperEnv,
  // createProxy,
} from "../../internals/build";

// https://vitejs.dev/config/
export default ({ mode, command }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_DROP_CONSOLE,
    // VITE_PROXY,
    // VITE_USE_SERVER_HTTPS,
  } = viteEnv;

  const isBuild = command === "build";

  // console.info('VITE_PROXY =>', VITE_PROXY);

  // console.info(JSON.stringify(mode === 'development'));
  return {
    base: VITE_PUBLIC_PATH,
    root: root,

    plugins: configVitePlugins(viteEnv, isBuild) as PluginOption[],
    define: {
      __IS_DEVELOPMENT__: JSON.stringify(mode === "development"),
    },

    worker: {
      format: "es",
    },

    build: {
      lib: {
        // entry: "./index.ts",
        entry: resolve(__dirname, 'index.ts'),
        // entry: "./index.ts",
        name: "viaz",
        // formats: ["es"],
      },
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        strictRequires: true, // 注意：这里必须是 true，否则会报错
      },
      rollupOptions: {
        external: [
          "vue",
          /ant-design-vue.*/,
          "sortablejs",
          "vue-json-pretty",
          "axios",
          "monaco-editor",
          "lodash-es",
          "lodash",
          "/lodash.*/",
          "@wangeditor/editor",
          "@wangeditor/editor-for-vue",
          "@visactor/vtable",
          "@shopify/draggable",
          "vue-draggable-plus",
        ],
        output: {
          globals: {
            vue: "vue",
            axios: "axios",
            lodash: "lodash",
            "monaco-editor": "monacoEditor",
            "lodash-es": "lodashEs",
            "vue-json-pretty": "VueJsonPretty",
            "ant-design-vue": "antDesignVue",
            "ant-design-vue/es": "antDesignVueEs",
            sortablejs: "Sortable",
            "@visactor/vtable": "vtable",
            "@shopify/draggable": "shopifyDraggable",
            "@wangeditor/editor-for-vue": "editorForVue",
            "vue-draggable-plus": "vueDraggablePlus",
          },
        },
      },
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ["console", "debugger"] : [],
    },
    server: {
      port: VITE_PORT,
      // https: VITE_USE_SERVER_HTTPS,
      host: true,
      // proxy: createProxy(VITE_PROXY),
    },
    css: {
      preprocessorOptions: {
        less: getLessOptions(isBuild),
      },
    },
    optimizeDeps: {
      include: [
        // `monaco-editor/esm/vs/language/json/json.worker`,
        // `monaco-editor/esm/vs/language/css/css.worker`,
        // `monaco-editor/esm/vs/language/html/html.worker`,
        // `monaco-editor/esm/vs/language/typescript/ts.worker`,
        // `monaco-editor/esm/vs/editor/editor.worker`,
      ],
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
  };
};
