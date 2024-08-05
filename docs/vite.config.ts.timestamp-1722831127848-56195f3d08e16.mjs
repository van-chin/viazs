// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite@5.3.5_@types+node@22.1.0_less@4.2.0/node_modules/vite/dist/node/index.js";
import UnoCSS2 from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.40_rollup@4.18.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/unocss/dist/vite.mjs";
import vueJsx2 from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0__vue@3.4.35_typescript@5.5.4_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Inspect2 from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite-plugin-inspect@0.8.5_rollup@4.18.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/vite-plugin-inspect/dist/index.mjs";
import vue from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.3.5_@types+node@22.1.0_less@4.2.0__vue@3.4.35_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// plugins/vite-plugin-md.ts
import path from "path";
import fs2 from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import MarkdownIt from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/markdown-it@14.1.0/node_modules/markdown-it/index.mjs";
import Shikiji from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/@shikijs+markdown-it@1.12.1/node_modules/@shikijs/markdown-it/dist/index.mjs";

// plugins/md-plugin.ts
function mdCustomH3(md2) {
  md2.renderer.rules.heading_open = (tokens, idx) => {
    const title = tokens[idx + 1].content;
    const level = tokens[idx].tag.at(-1);
    return `<a-typography-title
      :level="${level}"
      id="${title.replace(/[ ]/g, "-")}"
    >`;
  };
  md2.renderer.rules.heading_close = () => {
    return `</a-typography-title>`;
  };
}
function mdCustomLinkCls(md2) {
  const className = "yk-doc-link";
  md2.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
    const token = tokens[idx];
    const existingClasses = token.attrGet("class") || "";
    const classes = `${existingClasses} ${className}`.trim();
    token.attrSet("class", classes);
    token.attrSet("target", "_blank");
    return self.renderToken(tokens, idx, options);
  };
}

// plugins/util.ts
import fs from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import { join } from "path";
var __vite_injected_original_dirname = "D:\\Users\\Van\\Wss\\van-chin\\viazs\\docs\\plugins";
var replaceVariables = (template, variables) => {
  return template.replace(/#{(.+?)}#/g, (match, exp) => {
    const getValueFunc = new Function("data", `return data.${exp}`);
    return getValueFunc(variables) || "";
  });
};
function getTemplates(path2) {
  const templates2 = fs.readFileSync(join(__vite_injected_original_dirname, path2), "utf-8");
  const mdReg = /(?<start>(?:`|~){3})\w+:\s*(?<name>.+)(?:\r?\n)(?<content>[\s\S]*?)\k<start>/g;
  const result = {};
  let match;
  while ((match = mdReg.exec(templates2)) !== null) {
    const { name, content } = match.groups;
    result[name] = content;
  }
  return result;
}

// plugins/vite-plugin-md.ts
var md = MarkdownIt({
  html: true,
  xhtmlOut: false
});
md.use(mdCustomH3);
md.use(mdCustomLinkCls);
md.use(
  await Shikiji({
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark"
    }
  })
);
var templates = getTemplates("./vite-plugin-md.md");
var getTemplate = (flag, variables) => replaceVariables(templates[flag], variables);
function vite_plugin_md_default() {
  return {
    name: "vitePluginMarkdown",
    transform(code, id) {
      if (!id.endsWith(".md")) return;
      if (!id.includes("/demos/")) {
        console.info("no demos id =>", id);
        return {
          code: getTemplate("CONTRIBUTING", {
            content: md.render(code)
          })
        };
      }
      const importBucket = /* @__PURE__ */ new Set();
      const result = transformSnippetOrPure(id, code, importBucket);
      const importContent = Array.from(importBucket).join("\n");
      return {
        map: null,
        code: getTemplate("default", {
          importContent,
          content: md.render(result).replace(
            /(<table>[\s\S]*?<\/table>)/g,
            '<div class="table-container">$1</div>'
          )
        })
      };
    }
  };
}
function transformSnippetOrPure(id, code, importBucket) {
  const tagReg = /<(\w+)\s?\/>/;
  const snippetReg = /(?<q>:{3})(?<flag>snippet|pure)\s+(?<content>[\s\S]+?)\s+\k<q>/g;
  const matches = code.matchAll(snippetReg);
  let result = code;
  for (const match of matches) {
    const { flag, content } = match.groups;
    const { title, desc, demoName } = handleMatch(content);
    const demoTagName = demoName.match(tagReg)[1];
    const demoCompName = toKebabCase(demoTagName);
    const demoCode = fetchDemoCode(id, demoCompName);
    const importItem = `import ${demoTagName} from './${demoCompName}.vue';`;
    if (!importBucket.has(importItem)) {
      importBucket.add(importItem);
    }
    result = result.replace(
      match[0],
      getTemplate(flag, {
        title,
        demoName,
        demoCode: encodeURIComponent(demoCode),
        content: md.render(desc)
      })
    );
  }
  return result;
}
function handleMatch(content) {
  const lines = content.split(/\r?\n/);
  const len = lines.length;
  if (len === 1) {
    return {
      title: "",
      desc: "",
      demoName: lines[0]
    };
  } else if (len === 2) {
    return {
      title: lines[0],
      desc: "<p></p>",
      demoName: lines[1]
    };
  } else {
    return {
      title: lines[0],
      desc: lines[1] || "<p></p>",
      demoName: lines[2]
    };
  }
}
function fetchDemoCode(id, componentName) {
  const targetFile = `${componentName}.vue`;
  const absolutePath = path.resolve(path.dirname(id), targetFile);
  try {
    return fs2.readFileSync(absolutePath, "utf-8");
  } catch (error) {
    console.error(error);
  }
}
function toKebabCase(str) {
  return str.replace(/([a-zA-Z])([A-Z])/g, "$1-$2").toLowerCase();
}

// ../internals/build/utils/index.ts
import dotenv from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
function wrapperEnv(envConf) {
  const ret = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    if (envName === "VITE_PROXY" && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = "";
      }
    }
    ret[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}

// ../internals/build/vite/index.ts
import Vue from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.3.5_@types+node@22.1.0_less@4.2.0__vue@3.4.35_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0__vue@3.4.35_typescript@5.5.4_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// ../internals/build/vite/plugins/unoCssPlugin.ts
import UnoCSS from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.40_rollup@4.18.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/unocss/dist/vite.mjs";
import { presetExtra } from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/unocss-preset-extra@0.5.3_unocss@0.61.9_postcss@8.4.40_rollup@4.18.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0__/node_modules/unocss-preset-extra/dist/index.mjs";

// ../internals/build/vite/plugins/mkcertPlugin.ts
import mkcert from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite-plugin-mkcert@1.17.5_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
function configMkcert(env) {
  const { VITE_USE_SERVER_HTTPS } = env;
  const plugins = [];
  if (VITE_USE_SERVER_HTTPS) {
    plugins.push(
      mkcert({
        source: "coding"
      })
    );
  }
  return plugins;
}

// ../internals/build/vite/plugins/visualizerPlugin.ts
import { visualizer } from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0_rollup@4.18.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";

// ../internals/build/vite/plugins/svgLoaderPlugin.ts
import svgLoader from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.4.35_typescript@5.5.4_/node_modules/vite-svg-loader/index.js";

// ../internals/build/vite/plugins/dtsPlugin.ts
import dts from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@22.1.0_rollup@4.18.0_typescript@5.5.4_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/vite-plugin-dts/dist/index.mjs";

// ../internals/build/vite/plugins/inspectPlugin.ts
import Inspect from "file:///D:/Users/Van/Wss/van-chin/viazs/node_modules/.pnpm/vite-plugin-inspect@0.8.5_rollup@4.18.0_vite@5.3.5_@types+node@22.1.0_less@4.2.0_/node_modules/vite-plugin-inspect/dist/index.mjs";

// ../internals/build/vite/preprocessor/less.ts
import { resolve } from "path";
var pathResolve = (dir) => {
  return resolve(process.cwd(), ".", dir);
};
var getLessOptions = (isBuild, relativePath = "../../") => {
  if (isBuild === true) {
    return {
      // 全局注入 config.less
      additionalData: `@import (reference) "${pathResolve(
        `${relativePath}packages/themes/default/config.less`
      )}";`,
      javascriptEnabled: true
    };
  } else {
    return {
      // 全局注入 config.less
      additionalData: `@import (reference) "${pathResolve(
        `${relativePath}packages/themes/default/config.less`
      )}";`,
      javascriptEnabled: true
    };
  }
};

// ../internals/build/vite/proxy.ts
var httpsRE = /^https:\/\//;
function createProxy(list = []) {
  const proxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);
    if (target === "/") {
      proxyTargetList[prefix] = {
        target
      };
    } else {
      proxyTargetList[prefix] = {
        target,
        changeOrigin: true,
        ws: true,
        rewrite: (path2) => path2.replace(new RegExp(`^${prefix}`), ""),
        ...isHttps ? { secure: false } : {}
      };
    }
  }
  return proxyTargetList;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/Users/Van/Wss/van-chin/viazs/docs/vite.config.ts";
var vite_config_default = ({ mode, command }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_DROP_CONSOLE,
    VITE_PROXY
    // VITE_USE_SERVER_HTTPS,
  } = viteEnv;
  const isBuild = command === "build";
  return {
    base: VITE_PUBLIC_PATH,
    root,
    plugins: [
      vite_plugin_md_default(),
      UnoCSS2(),
      vue({
        include: [/\.(vue|md)$/],
        script: {
          defineModel: true
        },
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("iconify")
          }
        }
      }),
      vueJsx2(),
      Inspect2(),
      configMkcert(viteEnv)
    ],
    define: {
      __IS_DEVELOPMENT__: JSON.stringify(mode === "development")
    },
    worker: {
      format: "es"
    },
    build: {
      lib: {
        entry: "./index.ts",
        name: "viaz"
        // fileName: "viaz",
      },
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        strictRequires: true
        // 注意：这里必须是 true，否则会报错
      },
      rollupOptions: {
        external: [
          "monaco-editor",
          "vue",
          /ant-design-vue.*/,
          "sortablejs",
          "vue-json-pretty",
          "axios",
          "lodash-es",
          "overlayscrollbars",
          "@wangeditor/editor",
          "@wangeditor/editor-for-vue",
          "@visactor/vtable",
          "vue-draggable-plus"
        ],
        output: {
          globals: {
            vue: "vue",
            axios: "axios",
            "monaco-editor": "monacoEditor",
            "lodash-es": "lodashEs",
            "vue-json-pretty": "VueJsonPretty",
            "ant-design-vue": "antDesignVue",
            "ant-design-vue/es": "antDesignVueEs",
            sortablejs: "Sortable",
            overlayscrollbars: "overlayscrollbars",
            "@visactor/vtable": "vtable",
            "@wangeditor/editor-for-vue": "editorForVue",
            "vue-draggable-plus": "vueDraggablePlus"
          }
        }
      }
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ["console", "debugger"] : []
    },
    server: {
      port: VITE_PORT,
      // https: VITE_USE_SERVER_HTTPS,
      host: true,
      proxy: createProxy(VITE_PROXY)
    },
    css: {
      preprocessorOptions: {
        less: getLessOptions(isBuild, "../")
      }
    },
    optimizeDeps: {
      include: [
        // `monaco-editor/esm/vs/language/json/json.worker`,
        // `monaco-editor/esm/vs/language/css/css.worker`,
        // `monaco-editor/esm/vs/language/html/html.worker`,
        // `monaco-editor/esm/vs/language/typescript/ts.worker`,
        // `monaco-editor/esm/vs/editor/editor.worker`,
      ]
    },
    resolve: {
      dedupe: ["vue"],
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        viaz: fileURLToPath(
          new URL("../packages/viaz", __vite_injected_original_import_meta_url)
        ),
        "viaz/index": fileURLToPath(
          new URL("../packages/viaz/index", __vite_injected_original_import_meta_url)
        ),
        "@viaz/*": fileURLToPath(
          new URL("../packages/*", __vite_injected_original_import_meta_url)
        ),
        "@packages/components/**/*": fileURLToPath(
          new URL("../packages/components/**/*", __vite_injected_original_import_meta_url)
        )
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1tZC50cyIsICJwbHVnaW5zL21kLXBsdWdpbi50cyIsICJwbHVnaW5zL3V0aWwudHMiLCAiLi4vaW50ZXJuYWxzL2J1aWxkL3V0aWxzL2luZGV4LnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL2luZGV4LnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvdW5vQ3NzUGx1Z2luLnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvbWtjZXJ0UGx1Z2luLnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvdmlzdWFsaXplclBsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL3N2Z0xvYWRlclBsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL2R0c1BsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL2luc3BlY3RQbHVnaW4udHMiLCAiLi4vaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcHJlcHJvY2Vzc29yL2xlc3MudHMiLCAiLi4vaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcHJveHkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGRvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcZG9jc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92YW4tY2hpbi92aWF6cy9kb2NzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnLCBDb25maWdFbnYsIFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcblxyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcclxuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XHJcblxyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcblxyXG5pbXBvcnQgSW5zcGVjdCBmcm9tIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiO1xyXG4vLyBpbXBvcnQgY3JlYXRlVnVlUGx1Z2luIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuXHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5cclxuaW1wb3J0IHZpdGVQbHVnaW5NYXJrZG93biBmcm9tIFwiLi9wbHVnaW5zL3ZpdGUtcGx1Z2luLW1kXCI7XHJcblxyXG5pbXBvcnQge1xyXG5cdGNvbmZpZ1ZpdGVQbHVnaW5zLFxyXG5cdGdldExlc3NPcHRpb25zLFxyXG5cdHdyYXBwZXJFbnYsXHJcblx0Y3JlYXRlUHJveHksXHJcblx0Y29uZmlnTWtjZXJ0LFxyXG59IGZyb20gXCIuLi9pbnRlcm5hbHMvYnVpbGRcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUsIGNvbW1hbmQgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XHJcblx0Y29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XHJcblx0Y29uc3QgZW52ID0gbG9hZEVudihtb2RlLCByb290KTtcclxuXHRjb25zdCB2aXRlRW52ID0gd3JhcHBlckVudihlbnYpO1xyXG5cclxuXHRjb25zdCB7XHJcblx0XHRWSVRFX1BPUlQsXHJcblx0XHRWSVRFX1BVQkxJQ19QQVRILFxyXG5cdFx0VklURV9EUk9QX0NPTlNPTEUsXHJcblx0XHRWSVRFX1BST1hZLFxyXG5cdFx0Ly8gVklURV9VU0VfU0VSVkVSX0hUVFBTLFxyXG5cdH0gPSB2aXRlRW52O1xyXG5cclxuXHRjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gXCJidWlsZFwiO1xyXG5cclxuXHQvLyBjb25zb2xlLmluZm8oJ1ZJVEVfUFJPWFkgPT4nLCBWSVRFX1BST1hZKTtcclxuXHJcblx0Ly8gbGV0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gY29uZmlnVml0ZVBsdWdpbnMoXHJcblx0Ly8gICB2aXRlRW52LFxyXG5cdC8vICAgaXNCdWlsZFxyXG5cdC8vICkgYXMgUGx1Z2luT3B0aW9uW107XHJcblxyXG5cdC8vIHBsdWdpbnMucHVzaCh2aXRlUGx1Z2luTWFya2Rvd24oKSk7XHJcblxyXG5cdC8vIGNvbnNvbGUuaW5mbyhcInBsdWdpbnMgPT5cIiwgcGx1Z2lucyk7XHJcblxyXG5cdC8vIGNvbnNvbGUuaW5mbyhKU09OLnN0cmluZ2lmeShtb2RlID09PSAnZGV2ZWxvcG1lbnQnKSk7XHJcblx0cmV0dXJuIHtcclxuXHRcdGJhc2U6IFZJVEVfUFVCTElDX1BBVEgsXHJcblx0XHRyb290OiByb290LFxyXG5cclxuXHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0dml0ZVBsdWdpbk1hcmtkb3duKCksXHJcblx0XHRcdFVub0NTUygpLFxyXG5cdFx0XHR2dWUoe1xyXG5cdFx0XHRcdGluY2x1ZGU6IFsvXFwuKHZ1ZXxtZCkkL10sXHJcblx0XHRcdFx0c2NyaXB0OiB7XHJcblx0XHRcdFx0XHRkZWZpbmVNb2RlbDogdHJ1ZSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRlbXBsYXRlOiB7XHJcblx0XHRcdFx0XHRjb21waWxlck9wdGlvbnM6IHtcclxuXHRcdFx0XHRcdFx0aXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuaW5jbHVkZXMoXCJpY29uaWZ5XCIpLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9KSxcclxuXHRcdFx0dnVlSnN4KCksXHJcblx0XHRcdEluc3BlY3QoKSxcclxuXHRcdFx0Y29uZmlnTWtjZXJ0KHZpdGVFbnYpLFxyXG5cdFx0XSxcclxuXHRcdGRlZmluZToge1xyXG5cdFx0XHRfX0lTX0RFVkVMT1BNRU5UX186IEpTT04uc3RyaW5naWZ5KG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiksXHJcblx0XHR9LFxyXG5cclxuXHRcdHdvcmtlcjoge1xyXG5cdFx0XHRmb3JtYXQ6IFwiZXNcIixcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IHtcclxuXHRcdFx0bGliOiB7XHJcblx0XHRcdFx0ZW50cnk6IFwiLi9pbmRleC50c1wiLFxyXG5cdFx0XHRcdG5hbWU6IFwidmlhelwiLFxyXG5cdFx0XHRcdC8vIGZpbGVOYW1lOiBcInZpYXpcIixcclxuXHRcdFx0fSxcclxuXHRcdFx0bWluaWZ5OiBmYWxzZSxcclxuXHRcdFx0Y29tbW9uanNPcHRpb25zOiB7XHJcblx0XHRcdFx0dHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXHJcblx0XHRcdFx0c3RyaWN0UmVxdWlyZXM6IHRydWUsIC8vIFx1NkNFOFx1NjEwRlx1RkYxQVx1OEZEOVx1OTFDQ1x1NUZDNVx1OTg3Qlx1NjYyRiB0cnVlXHVGRjBDXHU1NDI2XHU1MjE5XHU0RjFBXHU2MkE1XHU5NTE5XHJcblx0XHRcdH0sXHJcblx0XHRcdHJvbGx1cE9wdGlvbnM6IHtcclxuXHRcdFx0XHRleHRlcm5hbDogW1xyXG5cdFx0XHRcdFx0XCJtb25hY28tZWRpdG9yXCIsXHJcblx0XHRcdFx0XHRcInZ1ZVwiLFxyXG5cdFx0XHRcdFx0L2FudC1kZXNpZ24tdnVlLiovLFxyXG5cdFx0XHRcdFx0XCJzb3J0YWJsZWpzXCIsXHJcblx0XHRcdFx0XHRcInZ1ZS1qc29uLXByZXR0eVwiLFxyXG5cdFx0XHRcdFx0XCJheGlvc1wiLFxyXG5cdFx0XHRcdFx0XCJsb2Rhc2gtZXNcIixcclxuXHRcdFx0XHRcdFwib3ZlcmxheXNjcm9sbGJhcnNcIixcclxuXHRcdFx0XHRcdFwiQHdhbmdlZGl0b3IvZWRpdG9yXCIsXHJcblx0XHRcdFx0XHRcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCIsXHJcblx0XHRcdFx0XHRcIkB2aXNhY3Rvci92dGFibGVcIixcclxuXHRcdFx0XHRcdFwidnVlLWRyYWdnYWJsZS1wbHVzXCIsXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRvdXRwdXQ6IHtcclxuXHRcdFx0XHRcdGdsb2JhbHM6IHtcclxuXHRcdFx0XHRcdFx0dnVlOiBcInZ1ZVwiLFxyXG5cdFx0XHRcdFx0XHRheGlvczogXCJheGlvc1wiLFxyXG5cdFx0XHRcdFx0XHRcIm1vbmFjby1lZGl0b3JcIjogXCJtb25hY29FZGl0b3JcIixcclxuXHRcdFx0XHRcdFx0XCJsb2Rhc2gtZXNcIjogXCJsb2Rhc2hFc1wiLFxyXG5cdFx0XHRcdFx0XHRcInZ1ZS1qc29uLXByZXR0eVwiOiBcIlZ1ZUpzb25QcmV0dHlcIixcclxuXHRcdFx0XHRcdFx0XCJhbnQtZGVzaWduLXZ1ZVwiOiBcImFudERlc2lnblZ1ZVwiLFxyXG5cdFx0XHRcdFx0XHRcImFudC1kZXNpZ24tdnVlL2VzXCI6IFwiYW50RGVzaWduVnVlRXNcIixcclxuXHRcdFx0XHRcdFx0c29ydGFibGVqczogXCJTb3J0YWJsZVwiLFxyXG5cdFx0XHRcdFx0XHRvdmVybGF5c2Nyb2xsYmFyczogXCJvdmVybGF5c2Nyb2xsYmFyc1wiLFxyXG5cdFx0XHRcdFx0XHRcIkB2aXNhY3Rvci92dGFibGVcIjogXCJ2dGFibGVcIixcclxuXHRcdFx0XHRcdFx0XCJAd2FuZ2VkaXRvci9lZGl0b3ItZm9yLXZ1ZVwiOiBcImVkaXRvckZvclZ1ZVwiLFxyXG5cdFx0XHRcdFx0XHRcInZ1ZS1kcmFnZ2FibGUtcGx1c1wiOiBcInZ1ZURyYWdnYWJsZVBsdXNcIixcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRlc2J1aWxkOiB7XHJcblx0XHRcdGRyb3A6IFZJVEVfRFJPUF9DT05TT0xFID8gW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdIDogW10sXHJcblx0XHR9LFxyXG5cdFx0c2VydmVyOiB7XHJcblx0XHRcdHBvcnQ6IFZJVEVfUE9SVCxcclxuXHRcdFx0Ly8gaHR0cHM6IFZJVEVfVVNFX1NFUlZFUl9IVFRQUyxcclxuXHRcdFx0aG9zdDogdHJ1ZSxcclxuXHRcdFx0cHJveHk6IGNyZWF0ZVByb3h5KFZJVEVfUFJPWFkpLFxyXG5cdFx0fSxcclxuXHRcdGNzczoge1xyXG5cdFx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcblx0XHRcdFx0bGVzczogZ2V0TGVzc09wdGlvbnMoaXNCdWlsZCwgXCIuLi9cIiksXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdFx0b3B0aW1pemVEZXBzOiB7XHJcblx0XHRcdGluY2x1ZGU6IFtcclxuXHRcdFx0XHQvLyBgbW9uYWNvLWVkaXRvci9lc20vdnMvbGFuZ3VhZ2UvanNvbi9qc29uLndvcmtlcmAsXHJcblx0XHRcdFx0Ly8gYG1vbmFjby1lZGl0b3IvZXNtL3ZzL2xhbmd1YWdlL2Nzcy9jc3Mud29ya2VyYCxcclxuXHRcdFx0XHQvLyBgbW9uYWNvLWVkaXRvci9lc20vdnMvbGFuZ3VhZ2UvaHRtbC9odG1sLndvcmtlcmAsXHJcblx0XHRcdFx0Ly8gYG1vbmFjby1lZGl0b3IvZXNtL3ZzL2xhbmd1YWdlL3R5cGVzY3JpcHQvdHMud29ya2VyYCxcclxuXHRcdFx0XHQvLyBgbW9uYWNvLWVkaXRvci9lc20vdnMvZWRpdG9yL2VkaXRvci53b3JrZXJgLFxyXG5cdFx0XHRdLFxyXG5cdFx0fSxcclxuXHRcdHJlc29sdmU6IHtcclxuXHRcdFx0ZGVkdXBlOiBbXCJ2dWVcIl0sXHJcblx0XHRcdGFsaWFzOiB7XHJcblx0XHRcdFx0XCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxyXG5cdFx0XHRcdHZpYXo6IGZpbGVVUkxUb1BhdGgoXHJcblx0XHRcdFx0XHRuZXcgVVJMKFwiLi4vcGFja2FnZXMvdmlhelwiLCBpbXBvcnQubWV0YS51cmwpXHJcblx0XHRcdFx0KSxcclxuXHRcdFx0XHRcInZpYXovaW5kZXhcIjogZmlsZVVSTFRvUGF0aChcclxuXHRcdFx0XHRcdG5ldyBVUkwoXCIuLi9wYWNrYWdlcy92aWF6L2luZGV4XCIsIGltcG9ydC5tZXRhLnVybClcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdFwiQHZpYXovKlwiOiBmaWxlVVJMVG9QYXRoKFxyXG5cdFx0XHRcdFx0bmV3IFVSTChcIi4uL3BhY2thZ2VzLypcIiwgaW1wb3J0Lm1ldGEudXJsKVxyXG5cdFx0XHRcdCksXHJcblx0XHRcdFx0XCJAcGFja2FnZXMvY29tcG9uZW50cy8qKi8qXCI6IGZpbGVVUkxUb1BhdGgoXHJcblx0XHRcdFx0XHRuZXcgVVJMKFwiLi4vcGFja2FnZXMvY29tcG9uZW50cy8qKi8qXCIsIGltcG9ydC5tZXRhLnVybClcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9O1xyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcZG9jc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGRvY3NcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1tZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92YW4tY2hpbi92aWF6cy9kb2NzL3BsdWdpbnMvdml0ZS1wbHVnaW4tbWQudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgU2hpa2lqaSBmcm9tIFwiQHNoaWtpanMvbWFya2Rvd24taXRcIjtcclxuaW1wb3J0IHsgbWRDdXN0b21IMywgbWRDdXN0b21MaW5rQ2xzIH0gZnJvbSBcIi4vbWQtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGdldFRlbXBsYXRlcywgcmVwbGFjZVZhcmlhYmxlcyB9IGZyb20gXCIuL3V0aWxcIjtcclxuaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmNvbnN0IG1kID0gTWFya2Rvd25JdCh7XHJcblx0aHRtbDogdHJ1ZSxcclxuXHR4aHRtbE91dDogZmFsc2UsXHJcbn0pO1xyXG5cclxubWQudXNlKG1kQ3VzdG9tSDMpO1xyXG5tZC51c2UobWRDdXN0b21MaW5rQ2xzKTtcclxubWQudXNlKFxyXG5cdGF3YWl0IFNoaWtpamkoe1xyXG5cdFx0dGhlbWVzOiB7XHJcblx0XHRcdGxpZ2h0OiBcInZpdGVzc2UtbGlnaHRcIixcclxuXHRcdFx0ZGFyazogXCJ2aXRlc3NlLWRhcmtcIixcclxuXHRcdH0sXHJcblx0fSlcclxuKTtcclxuXHJcbmNvbnN0IHRlbXBsYXRlcyA9IGdldFRlbXBsYXRlcyhcIi4vdml0ZS1wbHVnaW4tbWQubWRcIik7XHJcbmNvbnN0IGdldFRlbXBsYXRlID0gKGZsYWc6IHN0cmluZywgdmFyaWFibGVzOiB1bmtub3duKSA9PlxyXG5cdHJlcGxhY2VWYXJpYWJsZXModGVtcGxhdGVzW2ZsYWddLCB2YXJpYWJsZXMpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCk6IFBsdWdpbiB7XHJcblx0cmV0dXJuIHtcclxuXHRcdG5hbWU6IFwidml0ZVBsdWdpbk1hcmtkb3duXCIsXHJcblx0XHR0cmFuc2Zvcm0oY29kZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUuaW5mbyhcImlkID0+XCIsIGlkKTtcclxuXHRcdFx0aWYgKCFpZC5lbmRzV2l0aChcIi5tZFwiKSkgcmV0dXJuO1xyXG5cdFx0XHRpZiAoIWlkLmluY2x1ZGVzKFwiL2RlbW9zL1wiKSkge1xyXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhcIm5vIGRlbW9zIGlkID0+XCIsIGlkKTtcclxuXHRcdFx0XHQvLyAveWlrZS1kZXNpZ24tZGV2L0NPTlRSSUJVVElORy5tZFxyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRjb2RlOiBnZXRUZW1wbGF0ZShcIkNPTlRSSUJVVElOR1wiLCB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IG1kLnJlbmRlcihjb2RlKSxcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGRlbW8vc3JjLyogL2RlbW9zLypcclxuXHRcdFx0Y29uc3QgaW1wb3J0QnVja2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVNuaXBwZXRPclB1cmUoaWQsIGNvZGUsIGltcG9ydEJ1Y2tldCk7XHJcblx0XHRcdGNvbnN0IGltcG9ydENvbnRlbnQgPSBBcnJheS5mcm9tKGltcG9ydEJ1Y2tldCkuam9pbihcIlxcblwiKTtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bWFwOiBudWxsLFxyXG5cdFx0XHRcdGNvZGU6IGdldFRlbXBsYXRlKFwiZGVmYXVsdFwiLCB7XHJcblx0XHRcdFx0XHRpbXBvcnRDb250ZW50LFxyXG5cdFx0XHRcdFx0Y29udGVudDogbWRcclxuXHRcdFx0XHRcdFx0LnJlbmRlcihyZXN1bHQpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKFxyXG5cdFx0XHRcdFx0XHRcdC8oPHRhYmxlPltcXHNcXFNdKj88XFwvdGFibGU+KS9nLFxyXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwidGFibGUtY29udGFpbmVyXCI+JDE8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0fSksXHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybVNuaXBwZXRPclB1cmUoXHJcblx0aWQ6IHN0cmluZyxcclxuXHRjb2RlOiBzdHJpbmcsXHJcblx0aW1wb3J0QnVja2V0OiBTZXQ8c3RyaW5nPlxyXG4pIHtcclxuXHRjb25zdCB0YWdSZWcgPSAvPChcXHcrKVxccz9cXC8+LztcclxuXHQvKiogQHNlZSBodHRwczovL3JlZ2V4MTAxLmNvbS9yL3lTRmlHVS8zICovXHJcblx0Y29uc3Qgc25pcHBldFJlZyA9XHJcblx0XHQvKD88cT46ezN9KSg/PGZsYWc+c25pcHBldHxwdXJlKVxccysoPzxjb250ZW50PltcXHNcXFNdKz8pXFxzK1xcazxxPi9nO1xyXG5cdGNvbnN0IG1hdGNoZXMgPSBjb2RlLm1hdGNoQWxsKHNuaXBwZXRSZWcpO1xyXG5cdGxldCByZXN1bHQgPSBjb2RlO1xyXG5cclxuXHRmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMpIHtcclxuXHRcdGNvbnN0IHsgZmxhZywgY29udGVudCB9ID0gbWF0Y2guZ3JvdXBzO1xyXG5cdFx0Y29uc3QgeyB0aXRsZSwgZGVzYywgZGVtb05hbWUgfSA9IGhhbmRsZU1hdGNoKGNvbnRlbnQpO1xyXG5cdFx0Y29uc3QgZGVtb1RhZ05hbWUgPSBkZW1vTmFtZS5tYXRjaCh0YWdSZWcpWzFdO1xyXG5cdFx0Y29uc3QgZGVtb0NvbXBOYW1lID0gdG9LZWJhYkNhc2UoZGVtb1RhZ05hbWUpO1xyXG5cclxuXHRcdGNvbnN0IGRlbW9Db2RlID0gZmV0Y2hEZW1vQ29kZShpZCwgZGVtb0NvbXBOYW1lKTtcclxuXHRcdGNvbnN0IGltcG9ydEl0ZW0gPSBgaW1wb3J0ICR7ZGVtb1RhZ05hbWV9IGZyb20gJy4vJHtkZW1vQ29tcE5hbWV9LnZ1ZSc7YDtcclxuXHJcblx0XHRpZiAoIWltcG9ydEJ1Y2tldC5oYXMoaW1wb3J0SXRlbSkpIHtcclxuXHRcdFx0aW1wb3J0QnVja2V0LmFkZChpbXBvcnRJdGVtKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXN1bHQgPSByZXN1bHQucmVwbGFjZShcclxuXHRcdFx0bWF0Y2hbMF0sXHJcblx0XHRcdGdldFRlbXBsYXRlKGZsYWcsIHtcclxuXHRcdFx0XHR0aXRsZSxcclxuXHRcdFx0XHRkZW1vTmFtZSxcclxuXHRcdFx0XHRkZW1vQ29kZTogZW5jb2RlVVJJQ29tcG9uZW50KGRlbW9Db2RlKSxcclxuXHRcdFx0XHRjb250ZW50OiBtZC5yZW5kZXIoZGVzYyksXHJcblx0XHRcdH0pXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlTWF0Y2goY29udGVudDogc3RyaW5nKSB7XHJcblx0Y29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KC9cXHI/XFxuLyk7XHJcblx0Y29uc3QgbGVuID0gbGluZXMubGVuZ3RoO1xyXG5cclxuXHRpZiAobGVuID09PSAxKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR0aXRsZTogXCJcIixcclxuXHRcdFx0ZGVzYzogXCJcIixcclxuXHRcdFx0ZGVtb05hbWU6IGxpbmVzWzBdLFxyXG5cdFx0fTtcclxuXHR9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dGl0bGU6IGxpbmVzWzBdLFxyXG5cdFx0XHRkZXNjOiBcIjxwPjwvcD5cIixcclxuXHRcdFx0ZGVtb05hbWU6IGxpbmVzWzFdLFxyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dGl0bGU6IGxpbmVzWzBdLFxyXG5cdFx0XHRkZXNjOiBsaW5lc1sxXSB8fCBcIjxwPjwvcD5cIixcclxuXHRcdFx0ZGVtb05hbWU6IGxpbmVzWzJdLFxyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGZldGNoIGRlbW8gc291cmNlIGNvZGUgYnkgcmVsYXRpdmUgcGF0aFxyXG5mdW5jdGlvbiBmZXRjaERlbW9Db2RlKGlkOiBzdHJpbmcsIGNvbXBvbmVudE5hbWU6IHN0cmluZykge1xyXG5cdGNvbnN0IHRhcmdldEZpbGUgPSBgJHtjb21wb25lbnROYW1lfS52dWVgO1xyXG5cdGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoaWQpLCB0YXJnZXRGaWxlKTtcclxuXHJcblx0Ly8gY29uc29sZS5pbmZvKFwiYWJzb2x1dGVQYXRoID0+XCIsIGFic29sdXRlUGF0aCk7XHJcblxyXG5cdHRyeSB7XHJcblx0XHRyZXR1cm4gZnMucmVhZEZpbGVTeW5jKGFic29sdXRlUGF0aCwgXCJ1dGYtOFwiKTtcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0fVxyXG59XHJcblxyXG4vKiogQGV4YW1wbGUgQnV0dG9uUHJpbWFyeSAtPiBidXR0b24tcHJpbWFyeSAqL1xyXG5mdW5jdGlvbiB0b0tlYmFiQ2FzZShzdHI6IHN0cmluZykge1xyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpBLVpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxkb2NzXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcZG9jc1xcXFxwbHVnaW5zXFxcXG1kLXBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92YW4tY2hpbi92aWF6cy9kb2NzL3BsdWdpbnMvbWQtcGx1Z2luLnRzXCI7aW1wb3J0IE1hcmtkb3duSXQgZnJvbSBcIm1hcmtkb3duLWl0XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWRDdXN0b21IMyhtZDogTWFya2Rvd25JdCkge1xyXG4gIG1kLnJlbmRlcmVyLnJ1bGVzLmhlYWRpbmdfb3BlbiA9ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0b2tlbnNbaWR4ICsgMV0uY29udGVudDtcclxuICAgIGNvbnN0IGxldmVsID0gdG9rZW5zW2lkeF0udGFnLmF0KC0xKTtcclxuXHJcbiAgICByZXR1cm4gYDxhLXR5cG9ncmFwaHktdGl0bGVcclxuICAgICAgOmxldmVsPVwiJHtsZXZlbH1cIlxyXG4gICAgICBpZD1cIiR7dGl0bGUucmVwbGFjZSgvWyBdL2csIFwiLVwiKX1cIlxyXG4gICAgPmA7XHJcbiAgfTtcclxuXHJcbiAgbWQucmVuZGVyZXIucnVsZXMuaGVhZGluZ19jbG9zZSA9ICgpID0+IHtcclxuICAgIHJldHVybiBgPC9hLXR5cG9ncmFwaHktdGl0bGU+YDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWRDdXN0b21MaW5rQ2xzKG1kOiBNYXJrZG93bkl0KSB7XHJcbiAgY29uc3QgY2xhc3NOYW1lID0gXCJ5ay1kb2MtbGlua1wiO1xyXG5cclxuICAvLyBcdTkxQ0RcdTUxOTkgbGlua19vcGVuIFx1ODlDNFx1NTIxOVxyXG4gIG1kLnJlbmRlcmVyLnJ1bGVzLmxpbmtfb3BlbiA9ICh0b2tlbnMsIGlkeCwgb3B0aW9ucywgX2Vudiwgc2VsZikgPT4ge1xyXG4gICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XTtcclxuICAgIGNvbnN0IGV4aXN0aW5nQ2xhc3NlcyA9IHRva2VuLmF0dHJHZXQoXCJjbGFzc1wiKSB8fCBcIlwiO1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IGAke2V4aXN0aW5nQ2xhc3Nlc30gJHtjbGFzc05hbWV9YC50cmltKCk7XHJcblxyXG4gICAgdG9rZW4uYXR0clNldChcImNsYXNzXCIsIGNsYXNzZXMpO1xyXG4gICAgdG9rZW4uYXR0clNldChcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuXHJcbiAgICByZXR1cm4gc2VsZi5yZW5kZXJUb2tlbih0b2tlbnMsIGlkeCwgb3B0aW9ucyk7XHJcbiAgfTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcZG9jc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGRvY3NcXFxccGx1Z2luc1xcXFx1dGlsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3Zhbi1jaGluL3ZpYXpzL2RvY3MvcGx1Z2lucy91dGlsLnRzXCI7aW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5cclxuLyoqXHJcbiAqIFJlcGxhY2VzIHZhcmlhYmxlcyBpbiBhIGdpdmVuIHRlbXBsYXRlIHN0cmluZyB3aXRoIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGUgLSBUaGUgdGVtcGxhdGUgc3RyaW5nIGNvbnRhaW5pbmcgdmFyaWFibGUgcGxhY2Vob2xkZXJzLlxyXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBhbnk+fSB2YXJpYWJsZXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBrZXktdmFsdWUgcGFpcnMgZm9yIHZhcmlhYmxlIHJlcGxhY2VtZW50LlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGVtcGxhdGUgc3RyaW5nIHdpdGggdmFyaWFibGVzIHJlcGxhY2VkIGJ5IHRoZWlyIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHJlcGxhY2VWYXJpYWJsZXMgPSAoXHJcbiAgdGVtcGxhdGU6IHN0cmluZyxcclxuICB2YXJpYWJsZXM6IHsgW3g6IHN0cmluZ106IGFueSB9LFxyXG4pOiBzdHJpbmcgPT4ge1xyXG4gIC8qKlxyXG4gICAqIFJlcGxhY2UgdmFyaWFibGVzIGluIHRoZSB0ZW1wbGF0ZSBzdHJpbmcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggLSBUaGUgbWF0Y2hlZCBwbGFjZWhvbGRlciBzdHJpbmcgKGUuZy4sIFwiI3t2YXJpYWJsZX1cIikuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4cCAtIFRoZSBleHAgZXh0cmFjdGVkIGZyb20gdGhlIHBsYWNlaG9sZGVyLlxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSByZXBsYWNlbWVudCB2YWx1ZSBvciB0aGUgb3JpZ2luYWwgbWF0Y2ggaWYgdGhlIGtleSBpcyBub3QgZm91bmQgaW4gdmFyaWFibGVzLlxyXG4gICAqL1xyXG4gIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC8jeyguKz8pfSMvZywgKG1hdGNoLCBleHApID0+IHtcclxuICAgIGNvbnN0IGdldFZhbHVlRnVuYyA9IG5ldyBGdW5jdGlvbignZGF0YScsIGByZXR1cm4gZGF0YS4ke2V4cH1gKTtcclxuICAgIHJldHVybiBnZXRWYWx1ZUZ1bmModmFyaWFibGVzKSB8fCAnJztcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wbGF0ZXMocGF0aDogc3RyaW5nKSB7XHJcbiAgY29uc3QgdGVtcGxhdGVzID0gZnMucmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCBwYXRoKSwgJ3V0Zi04Jyk7XHJcbiAgLyoqIEBzZWUgaHR0cHM6Ly9yZWdleDEwMS5jb20vci9BMGVWT3IvMSAqL1xyXG4gIGNvbnN0IG1kUmVnID1cclxuICAgIC8oPzxzdGFydD4oPzpgfH4pezN9KVxcdys6XFxzKig/PG5hbWU+LispKD86XFxyP1xcbikoPzxjb250ZW50PltcXHNcXFNdKj8pXFxrPHN0YXJ0Pi9nO1xyXG4gIGNvbnN0IHJlc3VsdDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gIGxldCBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcclxuXHJcbiAgd2hpbGUgKChtYXRjaCA9IG1kUmVnLmV4ZWModGVtcGxhdGVzKSkgIT09IG51bGwpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgY29udGVudCB9ID0gPHsgbmFtZTogc3RyaW5nOyBjb250ZW50OiBzdHJpbmcgfT5tYXRjaC5ncm91cHM7XHJcblxyXG4gICAgcmVzdWx0W25hbWVdID0gY29udGVudDtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx1dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdXRpbHNcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmFuLWNoaW4vdmlhenMvaW50ZXJuYWxzL2J1aWxkL3V0aWxzL2luZGV4LnRzXCI7aW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuXHJcbmltcG9ydCB0eXBlIHsgUmVjb3JkYWJsZSwgVml0ZUVudiB9IGZyb20gXCJAdmlhei90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRGV2Rm4obW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZEZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBtb2RlID09PSBcInByb2R1Y3Rpb25cIjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgcGFja2FnZSBwcmV2aWV3XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBvcnRNb2RlKCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBwcm9jZXNzLmVudi5SRVBPUlQgPT09IFwidHJ1ZVwiO1xyXG59XHJcblxyXG4vLyBSZWFkIGFsbCBlbnZpcm9ubWVudCB2YXJpYWJsZSBjb25maWd1cmF0aW9uIGZpbGVzIHRvIHByb2Nlc3MuZW52XHJcbmV4cG9ydCBmdW5jdGlvbiB3cmFwcGVyRW52KGVudkNvbmY6IFJlY29yZGFibGUpOiBWaXRlRW52IHtcclxuICBjb25zdCByZXQ6IGFueSA9IHt9O1xyXG5cclxuICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMoZW52Q29uZikpIHtcclxuICAgIGxldCByZWFsTmFtZSA9IGVudkNvbmZbZW52TmFtZV0ucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIik7XHJcbiAgICByZWFsTmFtZSA9XHJcbiAgICAgIHJlYWxOYW1lID09PSBcInRydWVcIiA/IHRydWUgOiByZWFsTmFtZSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiByZWFsTmFtZTtcclxuXHJcbiAgICBpZiAoZW52TmFtZSA9PT0gXCJWSVRFX1BPUlRcIikge1xyXG4gICAgICByZWFsTmFtZSA9IE51bWJlcihyZWFsTmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZW52TmFtZSA9PT0gXCJWSVRFX1BST1hZXCIgJiYgcmVhbE5hbWUpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZWFsTmFtZSA9IEpTT04ucGFyc2UocmVhbE5hbWUucmVwbGFjZSgvJy9nLCAnXCInKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVhbE5hbWUgPSBcIlwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXRbZW52TmFtZV0gPSByZWFsTmFtZTtcclxuICAgIGlmICh0eXBlb2YgcmVhbE5hbWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcHJvY2Vzcy5lbnZbZW52TmFtZV0gPSByZWFsTmFtZTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYWxOYW1lID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgIHByb2Nlc3MuZW52W2Vudk5hbWVdID0gSlNPTi5zdHJpbmdpZnkocmVhbE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmV0O1xyXG59XHJcblxyXG4vKipcclxuICogXHU4M0I3XHU1M0Q2XHU1RjUzXHU1MjREXHU3M0FGXHU1ODgzXHU0RTBCXHU3NTFGXHU2NTQ4XHU3Njg0XHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHU1NDBEXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb25mRmlsZXMoKSB7XHJcbiAgY29uc3Qgc2NyaXB0ID0gcHJvY2Vzcy5lbnYubnBtX2xpZmVjeWNsZV9zY3JpcHQ7XHJcbiAgY29uc3QgcmVnID0gbmV3IFJlZ0V4cChcIi0tbW9kZSAoW2Etel9cXFxcZF0rKVwiKTtcclxuICBjb25zdCByZXN1bHQgPSByZWcuZXhlYyhzY3JpcHQgYXMgc3RyaW5nKSBhcyBhbnk7XHJcbiAgaWYgKHJlc3VsdCkge1xyXG4gICAgY29uc3QgbW9kZSA9IHJlc3VsdFsxXSBhcyBzdHJpbmc7XHJcbiAgICByZXR1cm4gW1wiLmVudlwiLCBgLmVudi4ke21vZGV9YF07XHJcbiAgfVxyXG4gIHJldHVybiBbXCIuZW52XCIsIFwiLmVudi5wcm9kdWN0aW9uXCJdO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgc3RhcnRpbmcgd2l0aCB0aGUgc3BlY2lmaWVkIHByZWZpeFxyXG4gKiBAcGFyYW0gbWF0Y2ggcHJlZml4XHJcbiAqIEBwYXJhbSBjb25mRmlsZXMgZXh0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52Q29uZmlnKG1hdGNoID0gXCJWSVRFX0dMT0JfXCIsIGNvbmZGaWxlcyA9IGdldENvbmZGaWxlcygpKSB7XHJcbiAgbGV0IGVudkNvbmZpZyA9IHt9O1xyXG4gIGNvbmZGaWxlcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBlbnYgPSBkb3RlbnYucGFyc2UoXHJcbiAgICAgICAgZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBpdGVtKSlcclxuICAgICAgKTtcclxuICAgICAgZW52Q29uZmlnID0geyAuLi5lbnZDb25maWcsIC4uLmVudiB9O1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBpbiBwYXJzaW5nICR7aXRlbX1gLCBlKTtcclxuICAgIH1cclxuICB9KTtcclxuICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKGBeKCR7bWF0Y2h9KWApO1xyXG4gIE9iamVjdC5rZXlzKGVudkNvbmZpZykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICBpZiAoIXJlZy50ZXN0KGtleSkpIHtcclxuICAgICAgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShlbnZDb25maWcsIGtleSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGVudkNvbmZpZztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB1c2VyIHJvb3QgZGlyZWN0b3J5XHJcbiAqIEBwYXJhbSBkaXIgZmlsZSBwYXRoXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9vdFBhdGgoLi4uZGlyOiBzdHJpbmdbXSkge1xyXG4gIHJldHVybiBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgLi4uZGlyKTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmFuLWNoaW4vdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBWdWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCB7IGNvbmZpZ1Vub0NzcyB9IGZyb20gXCIuL3BsdWdpbnMvdW5vQ3NzUGx1Z2luXCI7XHJcblxyXG5pbXBvcnQgeyBjb25maWdNa2NlcnQgfSBmcm9tIFwiLi9wbHVnaW5zL21rY2VydFBsdWdpblwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlnVmlzdWFsaXplciB9IGZyb20gXCIuL3BsdWdpbnMvdmlzdWFsaXplclBsdWdpblwiO1xyXG5cclxuaW1wb3J0IHsgY29uZmlnU3ZnTG9hZGVyIH0gZnJvbSBcIi4vcGx1Z2lucy9zdmdMb2FkZXJQbHVnaW5cIjtcclxuXHJcbmltcG9ydCB7IGNvbmZpZ0R0cyB9IGZyb20gXCIuL3BsdWdpbnMvZHRzUGx1Z2luXCI7XHJcbmltcG9ydCB7IGNvbmZpZ0luc3BlY3QgfSBmcm9tIFwiLi9wbHVnaW5zL2luc3BlY3RQbHVnaW5cIjtcclxuXHJcbmV4cG9ydCAqIGZyb20gXCIuL3ByZXByb2Nlc3Nvci9sZXNzXCI7XHJcblxyXG5leHBvcnQgKiBmcm9tIFwiLi9wcm94eVwiO1xyXG5cclxuZXhwb3J0IHsgY29uZmlnTWtjZXJ0IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnVml0ZVBsdWdpbnModml0ZUVudjogVml0ZUVudiwgaXNCdWlsZDogYm9vbGVhbikge1xyXG5cdGNvbnN0IHZpdGVQbHVnaW5zOiAoUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10pW10gPSBbXHJcblx0XHRWdWUoe1xyXG5cdFx0XHRpbmNsdWRlOiBbL1xcLih2dWV8bWQpJC9dLFxyXG5cdFx0XHRzY3JpcHQ6IHtcclxuXHRcdFx0XHRwcm9wc0Rlc3RydWN0dXJlOiB0cnVlLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSksXHJcblx0XHR2dWVKc3goKSxcclxuXHRdO1xyXG5cdGlmICghaXNCdWlsZCkge1xyXG5cdFx0dml0ZVBsdWdpbnMucHVzaChjb25maWdNa2NlcnQodml0ZUVudikpO1xyXG5cdH1cclxuXHJcblx0dml0ZVBsdWdpbnMucHVzaChjb25maWdJbnNwZWN0KCkpO1xyXG5cclxuXHR2aXRlUGx1Z2lucy5wdXNoKGNvbmZpZ1Vub0NzcygpKTtcclxuXHJcblx0dml0ZVBsdWdpbnMucHVzaChjb25maWdEdHMoKSk7XHJcblxyXG5cdHZpdGVQbHVnaW5zLnB1c2goY29uZmlnU3ZnTG9hZGVyKCkpO1xyXG5cclxuXHRpZiAoaXNCdWlsZCkge1xyXG5cdFx0dml0ZVBsdWdpbnMucHVzaChjb25maWdWaXN1YWxpemVyKCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZpdGVQbHVnaW5zIGFzIFBsdWdpbk9wdGlvbltdO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcXFxcdW5vQ3NzUGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3Zhbi1jaGluL3ZpYXpzL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvdW5vQ3NzUGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiO1xyXG5pbXBvcnQgeyBwcmVzZXRFeHRyYSB9IGZyb20gXCJ1bm9jc3MtcHJlc2V0LWV4dHJhXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnVW5vQ3NzKCk6IFBsdWdpbk9wdGlvbltdIHtcclxuXHRjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xyXG5cclxuXHRwbHVnaW5zLnB1c2goXHJcblx0XHRVbm9DU1Moe1xyXG5cdFx0XHRwcmVzZXRzOiBbcHJlc2V0RXh0cmEoKV0sXHJcblx0XHR9KVxyXG5cdCk7XHJcblxyXG5cdHJldHVybiBwbHVnaW5zO1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcXFxcbWtjZXJ0UGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3Zhbi1jaGluL3ZpYXpzL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvbWtjZXJ0UGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFZpdGVFbnYgfSBmcm9tIFwiQHZpYXovdHlwZXNcIjtcclxuaW1wb3J0IG1rY2VydCBmcm9tIFwidml0ZS1wbHVnaW4tbWtjZXJ0XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnTWtjZXJ0KGVudjogVml0ZUVudik6IFBsdWdpbk9wdGlvbltdIHtcclxuICBjb25zdCB7IFZJVEVfVVNFX1NFUlZFUl9IVFRQUyB9ID0gZW52O1xyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XHJcblxyXG4gIGlmIChWSVRFX1VTRV9TRVJWRVJfSFRUUFMpIHtcclxuICAgIHBsdWdpbnMucHVzaChcclxuICAgICAgbWtjZXJ0KHtcclxuICAgICAgICBzb3VyY2U6IFwiY29kaW5nXCIsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuICByZXR1cm4gcGx1Z2lucztcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXHZpc3VhbGl6ZXJQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmFuLWNoaW4vdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy92aXN1YWxpemVyUGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ1Zpc3VhbGl6ZXIoKTogUGx1Z2luT3B0aW9uW10ge1xyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XHJcblxyXG4gIHBsdWdpbnMucHVzaChcclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBvcGVuOiBmYWxzZSxcclxuICAgIH0pXHJcbiAgKTtcclxuICByZXR1cm4gcGx1Z2lucztcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXHN2Z0xvYWRlclBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92YW4tY2hpbi92aWF6cy9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL3N2Z0xvYWRlclBsdWdpbi50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSBcInZpdGUtc3ZnLWxvYWRlclwiO1xyXG4vLyBzdmdMb2FkZXJQbHVnaW5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWdTdmdMb2FkZXIoKTogUGx1Z2luT3B0aW9uW10ge1xyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XHJcblxyXG4gIHBsdWdpbnMucHVzaChzdmdMb2FkZXIoKSk7XHJcbiAgcmV0dXJuIHBsdWdpbnM7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1xcXFxkdHNQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmFuLWNoaW4vdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy9kdHNQbHVnaW4udHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcblxyXG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25maWdEdHMoKTogUGx1Z2luT3B0aW9uW10ge1xyXG4gIGNvbnN0IHBsdWdpbnM6IFBsdWdpbk9wdGlvbltdID0gW107XHJcblxyXG4gIHBsdWdpbnMucHVzaChcclxuICAgIGR0cyh7XHJcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXHJcbiAgICAgIC8vIHJvbGx1cFR5cGVzOiB0cnVlLFxyXG4gICAgICAvLyBleGNsdWRlOiBbXCJkaXN0XCIsIFwiZGlzdC8qKlwiLCBcIm5vZGVfbW9kdWxlcy8qKlwiXSxcclxuICAgIH0pXHJcbiAgKTtcclxuICByZXR1cm4gcGx1Z2lucztcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2YW4tY2hpblxcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGluc3BlY3RQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmFuLWNoaW4vdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy9pbnNwZWN0UGx1Z2luLnRzXCI7XHJcblxyXG5cclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuaW1wb3J0IEluc3BlY3QgZnJvbSAndml0ZS1wbHVnaW4taW5zcGVjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnSW5zcGVjdCgpOiBQbHVnaW5PcHRpb25bXSB7XHJcbiAgY29uc3QgcGx1Z2luczogUGx1Z2luT3B0aW9uW10gPSBbXTtcclxuXHJcbiAgcGx1Z2lucy5wdXNoKFxyXG4gICAgSW5zcGVjdCgpXHJcbiAgKTtcclxuICByZXR1cm4gcGx1Z2lucztcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmFuLWNoaW5cXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccHJlcHJvY2Vzc29yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHByZXByb2Nlc3NvclxcXFxsZXNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3Zhbi1jaGluL3ZpYXpzL2ludGVybmFscy9idWlsZC92aXRlL3ByZXByb2Nlc3Nvci9sZXNzLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcblxyXG5jb25zdCBwYXRoUmVzb2x2ZSA9IChkaXI6IHN0cmluZykgPT4ge1xyXG4gIHJldHVybiByZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLlwiLCBkaXIpO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0TGVzc09wdGlvbnMgPSAoaXNCdWlsZDogYm9vbGVhbiwgcmVsYXRpdmVQYXRoOiBzdHJpbmcgPSBcIi4uLy4uL1wiKSA9PiB7XHJcbiAgLy8gY29uc29sZS5pbmZvKCdnZXRMZXNzT3B0aW9ucy5pc0J1aWxkJyxpc0J1aWxkKTtcclxuICBpZiAoaXNCdWlsZCA9PT0gdHJ1ZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gXHU1MTY4XHU1QzQwXHU2Q0U4XHU1MTY1IGNvbmZpZy5sZXNzXHJcbiAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCAocmVmZXJlbmNlKSBcIiR7cGF0aFJlc29sdmUoXHJcbiAgICAgICAgYCR7cmVsYXRpdmVQYXRofXBhY2thZ2VzL3RoZW1lcy9kZWZhdWx0L2NvbmZpZy5sZXNzYFxyXG4gICAgICApfVwiO2AsXHJcbiAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gXHU1MTY4XHU1QzQwXHU2Q0U4XHU1MTY1IGNvbmZpZy5sZXNzXHJcbiAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCAocmVmZXJlbmNlKSBcIiR7cGF0aFJlc29sdmUoXHJcbiAgICAgICAgYCR7cmVsYXRpdmVQYXRofXBhY2thZ2VzL3RoZW1lcy9kZWZhdWx0L2NvbmZpZy5sZXNzYFxyXG4gICAgICApfVwiO2AsXHJcbiAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcbmV4cG9ydCB7IGdldExlc3NPcHRpb25zIH07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRMZXNzT3B0aW9ucztcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZhbi1jaGluXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3Zhbi1jaGluL3ZpYXpzL2ludGVybmFscy9idWlsZC92aXRlL3Byb3h5LnRzXCI7LyoqXHJcbiAqIFVzZWQgdG8gcGFyc2UgdGhlIC5lbnYuZGV2ZWxvcG1lbnQgcHJveHkgY29uZmlndXJhdGlvblxyXG4gKi9cclxuaW1wb3J0IHR5cGUgeyBQcm94eU9wdGlvbnMgfSBmcm9tIFwidml0ZVwiO1xyXG5cclxudHlwZSBQcm94eUl0ZW0gPSBbc3RyaW5nLCBzdHJpbmddO1xyXG5cclxudHlwZSBQcm94eUxpc3QgPSBQcm94eUl0ZW1bXTtcclxuXHJcbnR5cGUgUHJveHlUYXJnZXRMaXN0ID0gUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPjtcclxuXHJcbmNvbnN0IGh0dHBzUkUgPSAvXmh0dHBzOlxcL1xcLy87XHJcblxyXG4vKipcclxuICogR2VuZXJhdGUgcHJveHlcclxuICogQHBhcmFtIGxpc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm94eShsaXN0OiBQcm94eUxpc3QgPSBbXSkge1xyXG4gIC8vIGNvbnNvbGUuaW5mbygnbGlzdCA9PicsbGlzdCk7XHJcbiAgY29uc3QgcHJveHlUYXJnZXRMaXN0OiBQcm94eVRhcmdldExpc3QgPSB7fTtcclxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgbGlzdCkge1xyXG4gICAgY29uc3QgaXNIdHRwcyA9IGh0dHBzUkUudGVzdCh0YXJnZXQpO1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2h0dHAtcGFydHkvbm9kZS1odHRwLXByb3h5I29wdGlvbnNcclxuICAgIGlmICh0YXJnZXQgPT09IFwiL1wiKSB7XHJcbiAgICAgIC8vIGZvciBtb2NrXHJcbiAgICAgIHByb3h5VGFyZ2V0TGlzdFtwcmVmaXhdID0ge1xyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcHJveHlUYXJnZXRMaXN0W3ByZWZpeF0gPSB7XHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHdzOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cHJlZml4fWApLCBcIlwiKSxcclxuICAgICAgICAuLi4oaXNIdHRwcyA/IHsgc2VjdXJlOiBmYWxzZSB9IDoge30pLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY29uc29sZS5pbmZvKCdwcm94eVRhcmdldExpc3QgPT4nLHByb3h5VGFyZ2V0TGlzdCk7XHJcbiAgcmV0dXJuIHByb3h5VGFyZ2V0TGlzdDtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxlQUFlLFdBQVc7QUFDbkMsU0FBUyxlQUFlO0FBR3hCLE9BQU9BLGFBQVk7QUFDbkIsT0FBT0MsYUFBWTtBQUVuQixPQUFPQyxjQUFhO0FBR3BCLE9BQU8sU0FBUzs7O0FDWjRULE9BQU8sVUFBVTtBQUM3VixPQUFPQyxTQUFRO0FBQ2YsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxhQUFhOzs7QUNEYixTQUFTLFdBQVdDLEtBQWdCO0FBQ3pDLEVBQUFBLElBQUcsU0FBUyxNQUFNLGVBQWUsQ0FBQyxRQUFRLFFBQVE7QUFDaEQsVUFBTSxRQUFRLE9BQU8sTUFBTSxDQUFDLEVBQUU7QUFDOUIsVUFBTSxRQUFRLE9BQU8sR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFO0FBRW5DLFdBQU87QUFBQSxnQkFDSyxLQUFLO0FBQUEsWUFDVCxNQUFNLFFBQVEsUUFBUSxHQUFHLENBQUM7QUFBQTtBQUFBLEVBRXBDO0FBRUEsRUFBQUEsSUFBRyxTQUFTLE1BQU0sZ0JBQWdCLE1BQU07QUFDdEMsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUVPLFNBQVMsZ0JBQWdCQSxLQUFnQjtBQUM5QyxRQUFNLFlBQVk7QUFHbEIsRUFBQUEsSUFBRyxTQUFT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eUI7QUFBQSxRQUN6QixnQkFBZ0I7QUFBQTtBQUFBLE1BQ2pCO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDZCxVQUFVO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRDtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ1AsU0FBUztBQUFBLFlBQ1IsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsaUJBQWlCO0FBQUEsWUFDakIsYUFBYTtBQUFBLFlBQ2IsbUJBQW1CO0FBQUEsWUFDbkIsa0JBQWtCO0FBQUEsWUFDbEIscUJBQXFCO0FBQUEsWUFDckIsWUFBWTtBQUFBLFlBQ1osbUJBQW1CO0FBQUEsWUFDbkIsb0JBQW9CO0FBQUEsWUFDcEIsOEJBQThCO0FBQUEsWUFDOUIsc0JBQXNCO0FBQUEsVUFDdkI7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSLE1BQU0sb0JBQW9CLENBQUMsV0FBVyxVQUFVLElBQUksQ0FBQztBQUFBLElBQ3REO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDUCxNQUFNO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQSxNQUNOLE9BQU8sWUFBWSxVQUFVO0FBQUEsSUFDOUI7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNKLHFCQUFxQjtBQUFBLFFBQ3BCLE1BQU0sZUFBZSxTQUFTLEtBQUs7QUFBQSxNQUNwQztBQUFBLElBQ0Q7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNiLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFNVDtBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSLFFBQVEsQ0FBQyxLQUFLO0FBQUEsTUFDZCxPQUFPO0FBQUEsUUFDTixLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLFFBQ3BELE1BQU07QUFBQSxVQUNMLElBQUksSUFBSSxvQkFBb0Isd0NBQWU7QUFBQSxRQUM1QztBQUFBLFFBQ0EsY0FBYztBQUFBLFVBQ2IsSUFBSSxJQUFJLDBCQUEwQix3Q0FBZTtBQUFBLFFBQ2xEO0FBQUEsUUFDQSxXQUFXO0FBQUEsVUFDVixJQUFJLElBQUksaUJBQWlCLHdDQUFlO0FBQUEsUUFDekM7QUFBQSxRQUNBLDZCQUE2QjtBQUFBLFVBQzVCLElBQUksSUFBSSwrQkFBK0Isd0NBQWU7QUFBQSxRQUN2RDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEOyIsCiAgIm5hbWVzIjogWyJVbm9DU1MiLCAidnVlSnN4IiwgIkluc3BlY3QiLCAiZnMiLCAibWQiLCAicGF0aCIsICJ0ZW1wbGF0ZXMiLCAiZnMiLCAicGF0aCIsICJVbm9DU1MiLCAidnVlSnN4IiwgIkluc3BlY3QiXQp9Cg==
