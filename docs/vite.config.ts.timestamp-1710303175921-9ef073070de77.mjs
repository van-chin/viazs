// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/vite@5.1.6_@types+node@20.11.19_less@4.2.0/node_modules/vite/dist/node/index.js";
import UnoCSS2 from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/unocss@0.58.5_postcss@8.4.35_vite@5.1.6/node_modules/unocss/dist/vite.mjs";
import vueJsx2 from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.1.6_vue@3.4.25/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import createVuePlugin from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.6_vue@3.4.25/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// plugins/vite-plugin-md.ts
import path from "path";
import fs2 from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import MarkdownIt from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/markdown-it@14.0.0/node_modules/markdown-it/index.mjs";
import Shikiji from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/markdown-it-shikiji@0.10.2/node_modules/markdown-it-shikiji/dist/index.mjs";

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
import fs from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import { join } from "path";
var __vite_injected_original_dirname = "D:\\Users\\Van\\Wss\\viazs\\docs\\plugins";
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
      if (!id.endsWith(".md"))
        return;
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
import dotenv from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
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
import Vue from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.6_vue@3.4.25/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.1.6_vue@3.4.25/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// ../internals/build/vite/plugins/unoCssPlugin.ts
import UnoCSS from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/unocss@0.58.5_postcss@8.4.35_vite@5.1.6/node_modules/unocss/dist/vite.mjs";

// ../internals/build/vite/plugins/mkcertPlugin.ts
import mkcert from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/vite-plugin-mkcert@1.17.3_vite@5.1.6/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
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
import { visualizer } from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";

// ../internals/build/vite/plugins/svgLoaderPlugin.ts
import svgLoader from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.4.25/node_modules/vite-svg-loader/index.js";

// ../internals/build/vite/plugins/dtsPlugin.ts
import dts from "file:///D:/Users/Van/Wss/viazs/node_modules/.pnpm/vite-plugin-dts@3.7.3_@types+node@20.11.19_typescript@5.3.3_vite@5.1.6/node_modules/vite-plugin-dts/dist/index.mjs";

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
var __vite_injected_original_import_meta_url = "file:///D:/Users/Van/Wss/viazs/docs/vite.config.ts";
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
      vueJsx2(),
      configMkcert(viteEnv),
      createVuePlugin({
        include: [/\.(vue|md)$/],
        script: {
          defineModel: true
        },
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes("iconify")
          }
        }
      })
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
        viaz: fileURLToPath(new URL("../packages/viaz", __vite_injected_original_import_meta_url)),
        "viaz/index": fileURLToPath(
          new URL("../packages/viaz/index", __vite_injected_original_import_meta_url)
        ),
        "@viaz/*": fileURLToPath(new URL("../packages/*", __vite_injected_original_import_meta_url)),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1tZC50cyIsICJwbHVnaW5zL21kLXBsdWdpbi50cyIsICJwbHVnaW5zL3V0aWwudHMiLCAiLi4vaW50ZXJuYWxzL2J1aWxkL3V0aWxzL2luZGV4LnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL2luZGV4LnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvdW5vQ3NzUGx1Z2luLnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvbWtjZXJ0UGx1Z2luLnRzIiwgIi4uL2ludGVybmFscy9idWlsZC92aXRlL3BsdWdpbnMvdmlzdWFsaXplclBsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL3N2Z0xvYWRlclBsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL2R0c1BsdWdpbi50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wcmVwcm9jZXNzb3IvbGVzcy50cyIsICIuLi9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wcm94eS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcZG9jc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxkb2NzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3ZpYXpzL2RvY3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIENvbmZpZ0VudiwgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcblxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XG5cbmltcG9ydCBVbm9DU1MgZnJvbSBcInVub2Nzcy92aXRlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgY3JlYXRlVnVlUGx1Z2luIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcblxuaW1wb3J0IHZpdGVQbHVnaW5NYXJrZG93biBmcm9tIFwiLi9wbHVnaW5zL3ZpdGUtcGx1Z2luLW1kXCI7XG5cbmltcG9ydCB7XG4gIGNvbmZpZ1ZpdGVQbHVnaW5zLFxuICBnZXRMZXNzT3B0aW9ucyxcbiAgd3JhcHBlckVudixcbiAgY3JlYXRlUHJveHksXG4gIGNvbmZpZ01rY2VydCxcbn0gZnJvbSBcIi4uL2ludGVybmFscy9idWlsZFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSwgY29tbWFuZCB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdCk7XG4gIGNvbnN0IHZpdGVFbnYgPSB3cmFwcGVyRW52KGVudik7XG5cbiAgY29uc3Qge1xuICAgIFZJVEVfUE9SVCxcbiAgICBWSVRFX1BVQkxJQ19QQVRILFxuICAgIFZJVEVfRFJPUF9DT05TT0xFLFxuICAgIFZJVEVfUFJPWFksXG4gICAgLy8gVklURV9VU0VfU0VSVkVSX0hUVFBTLFxuICB9ID0gdml0ZUVudjtcblxuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gXCJidWlsZFwiO1xuXG4gIC8vIGNvbnNvbGUuaW5mbygnVklURV9QUk9YWSA9PicsIFZJVEVfUFJPWFkpO1xuXG4gIC8vIGxldCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IGNvbmZpZ1ZpdGVQbHVnaW5zKFxuICAvLyAgIHZpdGVFbnYsXG4gIC8vICAgaXNCdWlsZFxuICAvLyApIGFzIFBsdWdpbk9wdGlvbltdO1xuXG4gIC8vIHBsdWdpbnMucHVzaCh2aXRlUGx1Z2luTWFya2Rvd24oKSk7XG5cbiAgLy8gY29uc29sZS5pbmZvKFwicGx1Z2lucyA9PlwiLCBwbHVnaW5zKTtcblxuICAvLyBjb25zb2xlLmluZm8oSlNPTi5zdHJpbmdpZnkobW9kZSA9PT0gJ2RldmVsb3BtZW50JykpO1xuICByZXR1cm4ge1xuICAgIGJhc2U6IFZJVEVfUFVCTElDX1BBVEgsXG4gICAgcm9vdDogcm9vdCxcblxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZpdGVQbHVnaW5NYXJrZG93bigpLFxuICAgICAgVW5vQ1NTKCksXG4gICAgICB2dWVKc3goKSxcbiAgICAgIGNvbmZpZ01rY2VydCh2aXRlRW52KSxcbiAgICAgIGNyZWF0ZVZ1ZVBsdWdpbih7XG4gICAgICAgIGluY2x1ZGU6IFsvXFwuKHZ1ZXxtZCkkL10sXG4gICAgICAgIHNjcmlwdDoge1xuICAgICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgICAgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiB0YWcuaW5jbHVkZXMoXCJpY29uaWZ5XCIpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGRlZmluZToge1xuICAgICAgX19JU19ERVZFTE9QTUVOVF9fOiBKU09OLnN0cmluZ2lmeShtb2RlID09PSBcImRldmVsb3BtZW50XCIpLFxuICAgIH0sXG5cbiAgICB3b3JrZXI6IHtcbiAgICAgIGZvcm1hdDogXCJlc1wiLFxuICAgIH0sXG5cbiAgICBidWlsZDoge1xuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiBcIi4vaW5kZXgudHNcIixcbiAgICAgICAgbmFtZTogXCJ2aWF6XCIsXG4gICAgICAgIC8vIGZpbGVOYW1lOiBcInZpYXpcIixcbiAgICAgIH0sXG4gICAgICBtaW5pZnk6IGZhbHNlLFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgICBzdHJpY3RSZXF1aXJlczogdHJ1ZSwgLy8gXHU2Q0U4XHU2MTBGXHVGRjFBXHU4RkQ5XHU5MUNDXHU1RkM1XHU5ODdCXHU2NjJGIHRydWVcdUZGMENcdTU0MjZcdTUyMTlcdTRGMUFcdTYyQTVcdTk1MTlcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgICAgXCJtb25hY28tZWRpdG9yXCIsXG4gICAgICAgICAgXCJ2dWVcIixcbiAgICAgICAgICAvYW50LWRlc2lnbi12dWUuKi8sXG4gICAgICAgICAgXCJzb3J0YWJsZWpzXCIsXG4gICAgICAgICAgXCJ2dWUtanNvbi1wcmV0dHlcIixcbiAgICAgICAgICBcImF4aW9zXCIsXG4gICAgICAgICAgXCJsb2Rhc2gtZXNcIixcbiAgICAgICAgICBcIm92ZXJsYXlzY3JvbGxiYXJzXCIsXG4gICAgICAgICAgXCJAd2FuZ2VkaXRvci9lZGl0b3JcIixcbiAgICAgICAgICBcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCIsXG4gICAgICAgICAgXCJAdmlzYWN0b3IvdnRhYmxlXCIsXG4gICAgICAgICAgXCJ2dWUtZHJhZ2dhYmxlLXBsdXNcIixcbiAgICAgICAgXSxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgICAgdnVlOiBcInZ1ZVwiLFxuICAgICAgICAgICAgYXhpb3M6IFwiYXhpb3NcIixcbiAgICAgICAgICAgIFwibW9uYWNvLWVkaXRvclwiOiBcIm1vbmFjb0VkaXRvclwiLFxuICAgICAgICAgICAgXCJsb2Rhc2gtZXNcIjogXCJsb2Rhc2hFc1wiLFxuICAgICAgICAgICAgXCJ2dWUtanNvbi1wcmV0dHlcIjogXCJWdWVKc29uUHJldHR5XCIsXG4gICAgICAgICAgICBcImFudC1kZXNpZ24tdnVlXCI6IFwiYW50RGVzaWduVnVlXCIsXG4gICAgICAgICAgICBcImFudC1kZXNpZ24tdnVlL2VzXCI6IFwiYW50RGVzaWduVnVlRXNcIixcbiAgICAgICAgICAgIHNvcnRhYmxlanM6IFwiU29ydGFibGVcIixcbiAgICAgICAgICAgIG92ZXJsYXlzY3JvbGxiYXJzOiBcIm92ZXJsYXlzY3JvbGxiYXJzXCIsXG4gICAgICAgICAgICBcIkB2aXNhY3Rvci92dGFibGVcIjogXCJ2dGFibGVcIixcbiAgICAgICAgICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yLWZvci12dWVcIjogXCJlZGl0b3JGb3JWdWVcIixcbiAgICAgICAgICAgIFwidnVlLWRyYWdnYWJsZS1wbHVzXCI6IFwidnVlRHJhZ2dhYmxlUGx1c1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZXNidWlsZDoge1xuICAgICAgZHJvcDogVklURV9EUk9QX0NPTlNPTEUgPyBbXCJjb25zb2xlXCIsIFwiZGVidWdnZXJcIl0gOiBbXSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogVklURV9QT1JULFxuICAgICAgLy8gaHR0cHM6IFZJVEVfVVNFX1NFUlZFUl9IVFRQUyxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwcm94eTogY3JlYXRlUHJveHkoVklURV9QUk9YWSksXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgbGVzczogZ2V0TGVzc09wdGlvbnMoaXNCdWlsZCwgXCIuLi9cIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgIC8vIGBtb25hY28tZWRpdG9yL2VzbS92cy9sYW5ndWFnZS9qc29uL2pzb24ud29ya2VyYCxcbiAgICAgICAgLy8gYG1vbmFjby1lZGl0b3IvZXNtL3ZzL2xhbmd1YWdlL2Nzcy9jc3Mud29ya2VyYCxcbiAgICAgICAgLy8gYG1vbmFjby1lZGl0b3IvZXNtL3ZzL2xhbmd1YWdlL2h0bWwvaHRtbC53b3JrZXJgLFxuICAgICAgICAvLyBgbW9uYWNvLWVkaXRvci9lc20vdnMvbGFuZ3VhZ2UvdHlwZXNjcmlwdC90cy53b3JrZXJgLFxuICAgICAgICAvLyBgbW9uYWNvLWVkaXRvci9lc20vdnMvZWRpdG9yL2VkaXRvci53b3JrZXJgLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGRlZHVwZTogW1widnVlXCJdLFxuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICB2aWF6OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLi9wYWNrYWdlcy92aWF6XCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICBcInZpYXovaW5kZXhcIjogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgICBuZXcgVVJMKFwiLi4vcGFja2FnZXMvdmlhei9pbmRleFwiLCBpbXBvcnQubWV0YS51cmwpXG4gICAgICAgICksXG4gICAgICAgIFwiQHZpYXovKlwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuLi9wYWNrYWdlcy8qXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICBcIkBwYWNrYWdlcy9jb21wb25lbnRzLyoqLypcIjogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgICBuZXcgVVJMKFwiLi4vcGFja2FnZXMvY29tcG9uZW50cy8qKi8qXCIsIGltcG9ydC5tZXRhLnVybClcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcZG9jc1xcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGRvY3NcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1tZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92aWF6cy9kb2NzL3BsdWdpbnMvdml0ZS1wbHVnaW4tbWQudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgU2hpa2lqaSBmcm9tIFwibWFya2Rvd24taXQtc2hpa2lqaVwiO1xyXG5pbXBvcnQgeyBtZEN1c3RvbUgzLCBtZEN1c3RvbUxpbmtDbHMgfSBmcm9tIFwiLi9tZC1wbHVnaW5cIjtcclxuaW1wb3J0IHsgZ2V0VGVtcGxhdGVzLCByZXBsYWNlVmFyaWFibGVzIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuY29uc3QgbWQgPSBNYXJrZG93bkl0KHtcclxuICBodG1sOiB0cnVlLFxyXG4gIHhodG1sT3V0OiBmYWxzZSxcclxufSk7XHJcblxyXG5tZC51c2UobWRDdXN0b21IMyk7XHJcbm1kLnVzZShtZEN1c3RvbUxpbmtDbHMpO1xyXG5tZC51c2UoXHJcbiAgYXdhaXQgU2hpa2lqaSh7XHJcbiAgICB0aGVtZXM6IHtcclxuICAgICAgbGlnaHQ6IFwidml0ZXNzZS1saWdodFwiLFxyXG4gICAgICBkYXJrOiBcInZpdGVzc2UtZGFya1wiLFxyXG4gICAgfSxcclxuICB9KVxyXG4pO1xyXG5cclxuY29uc3QgdGVtcGxhdGVzID0gZ2V0VGVtcGxhdGVzKFwiLi92aXRlLXBsdWdpbi1tZC5tZFwiKTtcclxuY29uc3QgZ2V0VGVtcGxhdGUgPSAoZmxhZzogc3RyaW5nLCB2YXJpYWJsZXM6IHVua25vd24pID0+XHJcbiAgcmVwbGFjZVZhcmlhYmxlcyh0ZW1wbGF0ZXNbZmxhZ10sIHZhcmlhYmxlcyk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKTogUGx1Z2luIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJ2aXRlUGx1Z2luTWFya2Rvd25cIixcclxuICAgIHRyYW5zZm9ybShjb2RlOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcclxuICAgICAgLy8gY29uc29sZS5pbmZvKFwiaWQgPT5cIiwgaWQpO1xyXG4gICAgICBpZiAoIWlkLmVuZHNXaXRoKFwiLm1kXCIpKSByZXR1cm47XHJcbiAgICAgIGlmICghaWQuaW5jbHVkZXMoXCIvZGVtb3MvXCIpKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKFwibm8gZGVtb3MgaWQgPT5cIiwgaWQpO1xyXG4gICAgICAgIC8vIC95aWtlLWRlc2lnbi1kZXYvQ09OVFJJQlVUSU5HLm1kXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IGdldFRlbXBsYXRlKFwiQ09OVFJJQlVUSU5HXCIsIHtcclxuICAgICAgICAgICAgY29udGVudDogbWQucmVuZGVyKGNvZGUpLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZGVtby9zcmMvKiAvZGVtb3MvKlxyXG4gICAgICBjb25zdCBpbXBvcnRCdWNrZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtU25pcHBldE9yUHVyZShpZCwgY29kZSwgaW1wb3J0QnVja2V0KTtcclxuICAgICAgY29uc3QgaW1wb3J0Q29udGVudCA9IEFycmF5LmZyb20oaW1wb3J0QnVja2V0KS5qb2luKFwiXFxuXCIpO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBtYXA6IG51bGwsXHJcbiAgICAgICAgY29kZTogZ2V0VGVtcGxhdGUoXCJkZWZhdWx0XCIsIHtcclxuICAgICAgICAgIGltcG9ydENvbnRlbnQsXHJcbiAgICAgICAgICBjb250ZW50OiBtZFxyXG4gICAgICAgICAgICAucmVuZGVyKHJlc3VsdClcclxuICAgICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgICAgLyg8dGFibGU+W1xcc1xcU10qPzxcXC90YWJsZT4pL2csXHJcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ0YWJsZS1jb250YWluZXJcIj4kMTwvZGl2PidcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICB9KSxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHJhbnNmb3JtU25pcHBldE9yUHVyZShcclxuICBpZDogc3RyaW5nLFxyXG4gIGNvZGU6IHN0cmluZyxcclxuICBpbXBvcnRCdWNrZXQ6IFNldDxzdHJpbmc+XHJcbikge1xyXG4gIGNvbnN0IHRhZ1JlZyA9IC88KFxcdyspXFxzP1xcLz4vO1xyXG4gIC8qKiBAc2VlIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IveVNGaUdVLzMgKi9cclxuICBjb25zdCBzbmlwcGV0UmVnID1cclxuICAgIC8oPzxxPjp7M30pKD88ZmxhZz5zbmlwcGV0fHB1cmUpXFxzKyg/PGNvbnRlbnQ+W1xcc1xcU10rPylcXHMrXFxrPHE+L2c7XHJcbiAgY29uc3QgbWF0Y2hlcyA9IGNvZGUubWF0Y2hBbGwoc25pcHBldFJlZyk7XHJcbiAgbGV0IHJlc3VsdCA9IGNvZGU7XHJcblxyXG4gIGZvciAoY29uc3QgbWF0Y2ggb2YgbWF0Y2hlcykge1xyXG4gICAgY29uc3QgeyBmbGFnLCBjb250ZW50IH0gPSBtYXRjaC5ncm91cHM7XHJcbiAgICBjb25zdCB7IHRpdGxlLCBkZXNjLCBkZW1vTmFtZSB9ID0gaGFuZGxlTWF0Y2goY29udGVudCk7XHJcbiAgICBjb25zdCBkZW1vVGFnTmFtZSA9IGRlbW9OYW1lLm1hdGNoKHRhZ1JlZylbMV07XHJcbiAgICBjb25zdCBkZW1vQ29tcE5hbWUgPSB0b0tlYmFiQ2FzZShkZW1vVGFnTmFtZSk7XHJcblxyXG4gICAgY29uc3QgZGVtb0NvZGUgPSBmZXRjaERlbW9Db2RlKGlkLCBkZW1vQ29tcE5hbWUpO1xyXG4gICAgY29uc3QgaW1wb3J0SXRlbSA9IGBpbXBvcnQgJHtkZW1vVGFnTmFtZX0gZnJvbSAnLi8ke2RlbW9Db21wTmFtZX0udnVlJztgO1xyXG5cclxuICAgIGlmICghaW1wb3J0QnVja2V0LmhhcyhpbXBvcnRJdGVtKSkge1xyXG4gICAgICBpbXBvcnRCdWNrZXQuYWRkKGltcG9ydEl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKFxyXG4gICAgICBtYXRjaFswXSxcclxuICAgICAgZ2V0VGVtcGxhdGUoZmxhZywge1xyXG4gICAgICAgIHRpdGxlLFxyXG4gICAgICAgIGRlbW9OYW1lLFxyXG4gICAgICAgIGRlbW9Db2RlOiBlbmNvZGVVUklDb21wb25lbnQoZGVtb0NvZGUpLFxyXG4gICAgICAgIGNvbnRlbnQ6IG1kLnJlbmRlcihkZXNjKSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVNYXRjaChjb250ZW50OiBzdHJpbmcpIHtcclxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoL1xccj9cXG4vKTtcclxuICBjb25zdCBsZW4gPSBsaW5lcy5sZW5ndGg7XHJcblxyXG4gIGlmIChsZW4gPT09IDEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiBcIlwiLFxyXG4gICAgICBkZXNjOiBcIlwiLFxyXG4gICAgICBkZW1vTmFtZTogbGluZXNbMF0sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogbGluZXNbMF0sXHJcbiAgICAgIGRlc2M6IFwiPHA+PC9wPlwiLFxyXG4gICAgICBkZW1vTmFtZTogbGluZXNbMV0sXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogbGluZXNbMF0sXHJcbiAgICAgIGRlc2M6IGxpbmVzWzFdIHx8IFwiPHA+PC9wPlwiLFxyXG4gICAgICBkZW1vTmFtZTogbGluZXNbMl0sXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLy8gZmV0Y2ggZGVtbyBzb3VyY2UgY29kZSBieSByZWxhdGl2ZSBwYXRoXHJcbmZ1bmN0aW9uIGZldGNoRGVtb0NvZGUoaWQ6IHN0cmluZywgY29tcG9uZW50TmFtZTogc3RyaW5nKSB7XHJcbiAgY29uc3QgdGFyZ2V0RmlsZSA9IGAke2NvbXBvbmVudE5hbWV9LnZ1ZWA7XHJcbiAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShpZCksIHRhcmdldEZpbGUpO1xyXG5cclxuICAvLyBjb25zb2xlLmluZm8oXCJhYnNvbHV0ZVBhdGggPT5cIiwgYWJzb2x1dGVQYXRoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoYWJzb2x1dGVQYXRoLCBcInV0Zi04XCIpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKiBAZXhhbXBsZSBCdXR0b25QcmltYXJ5IC0+IGJ1dHRvbi1wcmltYXJ5ICovXHJcbmZ1bmN0aW9uIHRvS2ViYWJDYXNlKHN0cjogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2EtekEtWl0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGRvY3NcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxkb2NzXFxcXHBsdWdpbnNcXFxcbWQtcGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3ZpYXpzL2RvY3MvcGx1Z2lucy9tZC1wbHVnaW4udHNcIjtpbXBvcnQgTWFya2Rvd25JdCBmcm9tIFwibWFya2Rvd24taXRcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZEN1c3RvbUgzKG1kOiBNYXJrZG93bkl0KSB7XHJcbiAgbWQucmVuZGVyZXIucnVsZXMuaGVhZGluZ19vcGVuID0gKHRva2VucywgaWR4KSA9PiB7XHJcbiAgICBjb25zdCB0aXRsZSA9IHRva2Vuc1tpZHggKyAxXS5jb250ZW50O1xyXG4gICAgY29uc3QgbGV2ZWwgPSB0b2tlbnNbaWR4XS50YWcuYXQoLTEpO1xyXG5cclxuICAgIHJldHVybiBgPGEtdHlwb2dyYXBoeS10aXRsZVxyXG4gICAgICA6bGV2ZWw9XCIke2xldmVsfVwiXHJcbiAgICAgIGlkPVwiJHt0aXRsZS5yZXBsYWNlKC9bIF0vZywgXCItXCIpfVwiXHJcbiAgICA+YDtcclxuICB9O1xyXG5cclxuICBtZC5yZW5kZXJlci5ydWxlcy5oZWFkaW5nX2Nsb3NlID0gKCkgPT4ge1xyXG4gICAgcmV0dXJuIGA8L2EtdHlwb2dyYXBoeS10aXRsZT5gO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZEN1c3RvbUxpbmtDbHMobWQ6IE1hcmtkb3duSXQpIHtcclxuICBjb25zdCBjbGFzc05hbWUgPSBcInlrLWRvYy1saW5rXCI7XHJcblxyXG4gIC8vIFx1OTFDRFx1NTE5OSBsaW5rX29wZW4gXHU4OUM0XHU1MjE5XHJcbiAgbWQucmVuZGVyZXIucnVsZXMubGlua19vcGVuID0gKHRva2VucywgaWR4LCBvcHRpb25zLCBfZW52LCBzZWxmKSA9PiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdO1xyXG4gICAgY29uc3QgZXhpc3RpbmdDbGFzc2VzID0gdG9rZW4uYXR0ckdldChcImNsYXNzXCIpIHx8IFwiXCI7XHJcbiAgICBjb25zdCBjbGFzc2VzID0gYCR7ZXhpc3RpbmdDbGFzc2VzfSAke2NsYXNzTmFtZX1gLnRyaW0oKTtcclxuXHJcbiAgICB0b2tlbi5hdHRyU2V0KFwiY2xhc3NcIiwgY2xhc3Nlcyk7XHJcbiAgICB0b2tlbi5hdHRyU2V0KFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgIHJldHVybiBzZWxmLnJlbmRlclRva2VuKHRva2VucywgaWR4LCBvcHRpb25zKTtcclxuICB9O1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxkb2NzXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcZG9jc1xcXFxwbHVnaW5zXFxcXHV0aWwudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvZG9jcy9wbHVnaW5zL3V0aWwudHNcIjtpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcblxyXG4vKipcclxuICogUmVwbGFjZXMgdmFyaWFibGVzIGluIGEgZ2l2ZW4gdGVtcGxhdGUgc3RyaW5nIHdpdGggY29ycmVzcG9uZGluZyB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZSAtIFRoZSB0ZW1wbGF0ZSBzdHJpbmcgY29udGFpbmluZyB2YXJpYWJsZSBwbGFjZWhvbGRlcnMuXHJcbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIGFueT59IHZhcmlhYmxlcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGtleS12YWx1ZSBwYWlycyBmb3IgdmFyaWFibGUgcmVwbGFjZW1lbnQuXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZW1wbGF0ZSBzdHJpbmcgd2l0aCB2YXJpYWJsZXMgcmVwbGFjZWQgYnkgdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVwbGFjZVZhcmlhYmxlcyA9IChcclxuICB0ZW1wbGF0ZTogc3RyaW5nLFxyXG4gIHZhcmlhYmxlczogeyBbeDogc3RyaW5nXTogYW55IH0sXHJcbik6IHN0cmluZyA9PiB7XHJcbiAgLyoqXHJcbiAgICogUmVwbGFjZSB2YXJpYWJsZXMgaW4gdGhlIHRlbXBsYXRlIHN0cmluZy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaCAtIFRoZSBtYXRjaGVkIHBsYWNlaG9sZGVyIHN0cmluZyAoZS5nLiwgXCIje3ZhcmlhYmxlfVwiKS5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwIC0gVGhlIGV4cCBleHRyYWN0ZWQgZnJvbSB0aGUgcGxhY2Vob2xkZXIuXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHJlcGxhY2VtZW50IHZhbHVlIG9yIHRoZSBvcmlnaW5hbCBtYXRjaCBpZiB0aGUga2V5IGlzIG5vdCBmb3VuZCBpbiB2YXJpYWJsZXMuXHJcbiAgICovXHJcbiAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoLyN7KC4rPyl9Iy9nLCAobWF0Y2gsIGV4cCkgPT4ge1xyXG4gICAgY29uc3QgZ2V0VmFsdWVGdW5jID0gbmV3IEZ1bmN0aW9uKCdkYXRhJywgYHJldHVybiBkYXRhLiR7ZXhwfWApO1xyXG4gICAgcmV0dXJuIGdldFZhbHVlRnVuYyh2YXJpYWJsZXMpIHx8ICcnO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRlbXBsYXRlcyhwYXRoOiBzdHJpbmcpIHtcclxuICBjb25zdCB0ZW1wbGF0ZXMgPSBmcy5yZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsIHBhdGgpLCAndXRmLTgnKTtcclxuICAvKiogQHNlZSBodHRwczovL3JlZ2V4MTAxLmNvbS9yL0EwZVZPci8xICovXHJcbiAgY29uc3QgbWRSZWcgPVxyXG4gICAgLyg/PHN0YXJ0Pig/OmB8fil7M30pXFx3KzpcXHMqKD88bmFtZT4uKykoPzpcXHI/XFxuKSg/PGNvbnRlbnQ+W1xcc1xcU10qPylcXGs8c3RhcnQ+L2c7XHJcbiAgY29uc3QgcmVzdWx0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xyXG5cclxuICB3aGlsZSAoKG1hdGNoID0gbWRSZWcuZXhlYyh0ZW1wbGF0ZXMpKSAhPT0gbnVsbCkge1xyXG4gICAgY29uc3QgeyBuYW1lLCBjb250ZW50IH0gPSA8eyBuYW1lOiBzdHJpbmc7IGNvbnRlbnQ6IHN0cmluZyB9Pm1hdGNoLmdyb3VwcztcclxuXHJcbiAgICByZXN1bHRbbmFtZV0gPSBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx1dGlsc1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92aWF6cy9pbnRlcm5hbHMvYnVpbGQvdXRpbHMvaW5kZXgudHNcIjtpbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5cbmltcG9ydCB0eXBlIHsgUmVjb3JkYWJsZSwgVml0ZUVudiB9IGZyb20gXCJAdmlhei90eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZXZGbihtb2RlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZEZuKG1vZGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCI7XG59XG5cbi8qKlxuICogV2hldGhlciB0byBnZW5lcmF0ZSBwYWNrYWdlIHByZXZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwb3J0TW9kZSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LlJFUE9SVCA9PT0gXCJ0cnVlXCI7XG59XG5cbi8vIFJlYWQgYWxsIGVudmlyb25tZW50IHZhcmlhYmxlIGNvbmZpZ3VyYXRpb24gZmlsZXMgdG8gcHJvY2Vzcy5lbnZcbmV4cG9ydCBmdW5jdGlvbiB3cmFwcGVyRW52KGVudkNvbmY6IFJlY29yZGFibGUpOiBWaXRlRW52IHtcbiAgY29uc3QgcmV0OiBhbnkgPSB7fTtcblxuICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMoZW52Q29uZikpIHtcbiAgICBsZXQgcmVhbE5hbWUgPSBlbnZDb25mW2Vudk5hbWVdLnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpO1xuICAgIHJlYWxOYW1lID1cbiAgICAgIHJlYWxOYW1lID09PSBcInRydWVcIiA/IHRydWUgOiByZWFsTmFtZSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiByZWFsTmFtZTtcblxuICAgIGlmIChlbnZOYW1lID09PSBcIlZJVEVfUE9SVFwiKSB7XG4gICAgICByZWFsTmFtZSA9IE51bWJlcihyZWFsTmFtZSk7XG4gICAgfVxuICAgIGlmIChlbnZOYW1lID09PSBcIlZJVEVfUFJPWFlcIiAmJiByZWFsTmFtZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVhbE5hbWUgPSBKU09OLnBhcnNlKHJlYWxOYW1lLnJlcGxhY2UoLycvZywgJ1wiJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVhbE5hbWUgPSBcIlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXRbZW52TmFtZV0gPSByZWFsTmFtZTtcbiAgICBpZiAodHlwZW9mIHJlYWxOYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBwcm9jZXNzLmVudltlbnZOYW1lXSA9IHJlYWxOYW1lO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYWxOYW1lID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBwcm9jZXNzLmVudltlbnZOYW1lXSA9IEpTT04uc3RyaW5naWZ5KHJlYWxOYW1lKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTczQUZcdTU4ODNcdTRFMEJcdTc1MUZcdTY1NDhcdTc2ODRcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTU0MERcbiAqL1xuZnVuY3Rpb24gZ2V0Q29uZkZpbGVzKCkge1xuICBjb25zdCBzY3JpcHQgPSBwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX3NjcmlwdDtcbiAgY29uc3QgcmVnID0gbmV3IFJlZ0V4cChcIi0tbW9kZSAoW2Etel9cXFxcZF0rKVwiKTtcbiAgY29uc3QgcmVzdWx0ID0gcmVnLmV4ZWMoc2NyaXB0IGFzIHN0cmluZykgYXMgYW55O1xuICBpZiAocmVzdWx0KSB7XG4gICAgY29uc3QgbW9kZSA9IHJlc3VsdFsxXSBhcyBzdHJpbmc7XG4gICAgcmV0dXJuIFtcIi5lbnZcIiwgYC5lbnYuJHttb2RlfWBdO1xuICB9XG4gIHJldHVybiBbXCIuZW52XCIsIFwiLmVudi5wcm9kdWN0aW9uXCJdO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHN0YXJ0aW5nIHdpdGggdGhlIHNwZWNpZmllZCBwcmVmaXhcbiAqIEBwYXJhbSBtYXRjaCBwcmVmaXhcbiAqIEBwYXJhbSBjb25mRmlsZXMgZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnZDb25maWcobWF0Y2ggPSBcIlZJVEVfR0xPQl9cIiwgY29uZkZpbGVzID0gZ2V0Q29uZkZpbGVzKCkpIHtcbiAgbGV0IGVudkNvbmZpZyA9IHt9O1xuICBjb25mRmlsZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbnYgPSBkb3RlbnYucGFyc2UoXG4gICAgICAgIGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgaXRlbSkpXG4gICAgICApO1xuICAgICAgZW52Q29uZmlnID0geyAuLi5lbnZDb25maWcsIC4uLmVudiB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGluIHBhcnNpbmcgJHtpdGVtfWAsIGUpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoYF4oJHttYXRjaH0pYCk7XG4gIE9iamVjdC5rZXlzKGVudkNvbmZpZykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKCFyZWcudGVzdChrZXkpKSB7XG4gICAgICBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGVudkNvbmZpZywga2V5KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZW52Q29uZmlnO1xufVxuXG4vKipcbiAqIEdldCB1c2VyIHJvb3QgZGlyZWN0b3J5XG4gKiBAcGFyYW0gZGlyIGZpbGUgcGF0aFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9vdFBhdGgoLi4uZGlyOiBzdHJpbmdbXSkge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIC4uLmRpcik7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgVnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB2dWVKc3ggZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjtcbmltcG9ydCB7IGNvbmZpZ1Vub0NzcyB9IGZyb20gXCIuL3BsdWdpbnMvdW5vQ3NzUGx1Z2luXCI7XG5cbmltcG9ydCB7IGNvbmZpZ01rY2VydCB9IGZyb20gXCIuL3BsdWdpbnMvbWtjZXJ0UGx1Z2luXCI7XG5cbmltcG9ydCB7IGNvbmZpZ1Zpc3VhbGl6ZXIgfSBmcm9tIFwiLi9wbHVnaW5zL3Zpc3VhbGl6ZXJQbHVnaW5cIjtcblxuaW1wb3J0IHsgY29uZmlnU3ZnTG9hZGVyIH0gZnJvbSBcIi4vcGx1Z2lucy9zdmdMb2FkZXJQbHVnaW5cIjtcblxuaW1wb3J0IHsgY29uZmlnRHRzIH0gZnJvbSBcIi4vcGx1Z2lucy9kdHNQbHVnaW5cIjtcblxuZXhwb3J0ICogZnJvbSBcIi4vcHJlcHJvY2Vzc29yL2xlc3NcIjtcblxuZXhwb3J0ICogZnJvbSBcIi4vcHJveHlcIjtcblxuZXhwb3J0IHsgY29uZmlnTWtjZXJ0IH07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdWaXRlUGx1Z2lucyh2aXRlRW52OiBWaXRlRW52LCBpc0J1aWxkOiBib29sZWFuKSB7XG4gIGNvbnN0IHZpdGVQbHVnaW5zOiAoUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10pW10gPSBbXG4gICAgVnVlKHtcbiAgICAgIGluY2x1ZGU6IFsvXFwuKHZ1ZXxtZCkkL10sXG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgcHJvcHNEZXN0cnVjdHVyZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgdnVlSnN4KCksXG4gIF07XG4gIGlmICghaXNCdWlsZCkge1xuICAgIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnTWtjZXJ0KHZpdGVFbnYpKTtcbiAgfVxuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnVW5vQ3NzKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnRHRzKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnU3ZnTG9hZGVyKCkpO1xuXG4gIGlmIChpc0J1aWxkKSB7XG4gICAgdml0ZVBsdWdpbnMucHVzaChjb25maWdWaXN1YWxpemVyKCkpO1xuICB9XG5cbiAgcmV0dXJuIHZpdGVQbHVnaW5zIGFzIFBsdWdpbk9wdGlvbltdO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1xcXFx1bm9Dc3NQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy91bm9Dc3NQbHVnaW4udHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSBcInVub2Nzcy92aXRlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnVW5vQ3NzKCk6IFBsdWdpbk9wdGlvbltdIHtcclxuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xyXG5cclxuICBwbHVnaW5zLnB1c2goVW5vQ1NTKCkpO1xyXG5cclxuICByZXR1cm4gcGx1Z2lucztcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXG1rY2VydFBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92aWF6cy9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wbHVnaW5zL21rY2VydFBsdWdpbi50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0eXBlIHsgVml0ZUVudiB9IGZyb20gXCJAdmlhei90eXBlc1wiO1xuaW1wb3J0IG1rY2VydCBmcm9tIFwidml0ZS1wbHVnaW4tbWtjZXJ0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdNa2NlcnQoZW52OiBWaXRlRW52KTogUGx1Z2luT3B0aW9uW10ge1xuICBjb25zdCB7IFZJVEVfVVNFX1NFUlZFUl9IVFRQUyB9ID0gZW52O1xuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xuXG4gIGlmIChWSVRFX1VTRV9TRVJWRVJfSFRUUFMpIHtcbiAgICBwbHVnaW5zLnB1c2goXG4gICAgICBta2NlcnQoe1xuICAgICAgICBzb3VyY2U6IFwiY29kaW5nXCIsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHBsdWdpbnM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXHZpc3VhbGl6ZXJQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy92aXN1YWxpemVyUGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ1Zpc3VhbGl6ZXIoKTogUGx1Z2luT3B0aW9uW10ge1xuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xuXG4gIHBsdWdpbnMucHVzaChcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgIH0pXG4gICk7XG4gIHJldHVybiBwbHVnaW5zO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1xcXFxzdmdMb2FkZXJQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy9zdmdMb2FkZXJQbHVnaW4udHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5cbmltcG9ydCBzdmdMb2FkZXIgZnJvbSBcInZpdGUtc3ZnLWxvYWRlclwiO1xuLy8gc3ZnTG9hZGVyUGx1Z2luXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdTdmdMb2FkZXIoKTogUGx1Z2luT3B0aW9uW10ge1xuICBjb25zdCBwbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtdO1xuXG4gIHBsdWdpbnMucHVzaChzdmdMb2FkZXIoKSk7XG4gIHJldHVybiBwbHVnaW5zO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXFZhblxcXFxXc3NcXFxcdmlhenNcXFxcaW50ZXJuYWxzXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luc1xcXFxkdHNQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL1Zhbi9Xc3MvdmlhenMvaW50ZXJuYWxzL2J1aWxkL3ZpdGUvcGx1Z2lucy9kdHNQbHVnaW4udHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gXCJ2aXRlXCI7XG5cbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnRHRzKCk6IFBsdWdpbk9wdGlvbltdIHtcbiAgY29uc3QgcGx1Z2luczogUGx1Z2luT3B0aW9uW10gPSBbXTtcblxuICBwbHVnaW5zLnB1c2goXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICAvLyByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICAgIC8vIGV4Y2x1ZGU6IFtcImRpc3RcIiwgXCJkaXN0LyoqXCIsIFwibm9kZV9tb2R1bGVzLyoqXCJdLFxuICAgIH0pXG4gICk7XG4gIHJldHVybiBwbHVnaW5zO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHByZXByb2Nlc3NvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVXNlcnNcXFxcVmFuXFxcXFdzc1xcXFx2aWF6c1xcXFxpbnRlcm5hbHNcXFxcYnVpbGRcXFxcdml0ZVxcXFxwcmVwcm9jZXNzb3JcXFxcbGVzcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvVmFuL1dzcy92aWF6cy9pbnRlcm5hbHMvYnVpbGQvdml0ZS9wcmVwcm9jZXNzb3IvbGVzcy50c1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuXG5jb25zdCBwYXRoUmVzb2x2ZSA9IChkaXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcIi5cIiwgZGlyKTtcbn07XG5cbmNvbnN0IGdldExlc3NPcHRpb25zID0gKGlzQnVpbGQ6IGJvb2xlYW4sIHJlbGF0aXZlUGF0aDogc3RyaW5nID0gXCIuLi8uLi9cIikgPT4ge1xuICAvLyBjb25zb2xlLmluZm8oJ2dldExlc3NPcHRpb25zLmlzQnVpbGQnLGlzQnVpbGQpO1xuICBpZiAoaXNCdWlsZCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBcdTUxNjhcdTVDNDBcdTZDRThcdTUxNjUgY29uZmlnLmxlc3NcbiAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCAocmVmZXJlbmNlKSBcIiR7cGF0aFJlc29sdmUoXG4gICAgICAgIGAke3JlbGF0aXZlUGF0aH1wYWNrYWdlcy90aGVtZXMvZGVmYXVsdC9jb25maWcubGVzc2BcbiAgICAgICl9XCI7YCxcbiAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFx1NTE2OFx1NUM0MFx1NkNFOFx1NTE2NSBjb25maWcubGVzc1xuICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IChyZWZlcmVuY2UpIFwiJHtwYXRoUmVzb2x2ZShcbiAgICAgICAgYCR7cmVsYXRpdmVQYXRofXBhY2thZ2VzL3RoZW1lcy9kZWZhdWx0L2NvbmZpZy5sZXNzYFxuICAgICAgKX1cIjtgLFxuICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgfTtcbiAgfVxufTtcbmV4cG9ydCB7IGdldExlc3NPcHRpb25zIH07XG5cbmV4cG9ydCBkZWZhdWx0IGdldExlc3NPcHRpb25zO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxWYW5cXFxcV3NzXFxcXHZpYXpzXFxcXGludGVybmFsc1xcXFxidWlsZFxcXFx2aXRlXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Vc2Vycy9WYW4vV3NzL3ZpYXpzL2ludGVybmFscy9idWlsZC92aXRlL3Byb3h5LnRzXCI7LyoqXG4gKiBVc2VkIHRvIHBhcnNlIHRoZSAuZW52LmRldmVsb3BtZW50IHByb3h5IGNvbmZpZ3VyYXRpb25cbiAqL1xuaW1wb3J0IHR5cGUgeyBQcm94eU9wdGlvbnMgfSBmcm9tIFwidml0ZVwiO1xuXG50eXBlIFByb3h5SXRlbSA9IFtzdHJpbmcsIHN0cmluZ107XG5cbnR5cGUgUHJveHlMaXN0ID0gUHJveHlJdGVtW107XG5cbnR5cGUgUHJveHlUYXJnZXRMaXN0ID0gUmVjb3JkPHN0cmluZywgUHJveHlPcHRpb25zPjtcblxuY29uc3QgaHR0cHNSRSA9IC9eaHR0cHM6XFwvXFwvLztcblxuLyoqXG4gKiBHZW5lcmF0ZSBwcm94eVxuICogQHBhcmFtIGxpc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3h5KGxpc3Q6IFByb3h5TGlzdCA9IFtdKSB7XG4gIC8vIGNvbnNvbGUuaW5mbygnbGlzdCA9PicsbGlzdCk7XG4gIGNvbnN0IHByb3h5VGFyZ2V0TGlzdDogUHJveHlUYXJnZXRMaXN0ID0ge307XG4gIGZvciAoY29uc3QgW3ByZWZpeCwgdGFyZ2V0XSBvZiBsaXN0KSB7XG4gICAgY29uc3QgaXNIdHRwcyA9IGh0dHBzUkUudGVzdCh0YXJnZXQpO1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9odHRwLXBhcnR5L25vZGUtaHR0cC1wcm94eSNvcHRpb25zXG4gICAgaWYgKHRhcmdldCA9PT0gXCIvXCIpIHtcbiAgICAgIC8vIGZvciBtb2NrXG4gICAgICBwcm94eVRhcmdldExpc3RbcHJlZml4XSA9IHtcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94eVRhcmdldExpc3RbcHJlZml4XSA9IHtcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7cHJlZml4fWApLCBcIlwiKSxcbiAgICAgICAgLi4uKGlzSHR0cHMgPyB7IHNlY3VyZTogZmFsc2UgfSA6IHt9KSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5pbmZvKCdwcm94eVRhcmdldExpc3QgPT4nLHByb3h5VGFyZ2V0TGlzdCk7XG4gIHJldHVybiBwcm94eVRhcmdldExpc3Q7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxlQUFlLFdBQVc7QUFDbkMsU0FBUyxlQUFlO0FBR3hCLE9BQU9BLGFBQVk7QUFDbkIsT0FBT0MsYUFBWTtBQUNuQixPQUFPLHFCQUFxQjs7O0FDUm1SLE9BQU8sVUFBVTtBQUNoVSxPQUFPQyxTQUFRO0FBQ2YsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxhQUFhOzs7QUNEYixTQUFTLFdBQVdDLEtBQWdCO0FBQ3pDLEVBQUFBLElBQUcsU0FBUyxNQUFNLGVBQWUsQ0FBQyxRQUFRLFFBQVE7QUFDaEQsVUFBTSxRQUFRLE9BQU8sTUFBTSxDQUFDLEVBQUU7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O0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1UO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsUUFBUSxDQUFDLEtBQUs7QUFBQSxNQUNkLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsUUFDcEQsTUFBTSxjQUFjLElBQUksSUFBSSxvQkFBb0Isd0NBQWUsQ0FBQztBQUFBLFFBQ2hFLGNBQWM7QUFBQSxVQUNaLElBQUksSUFBSSwwQkFBMEIsd0NBQWU7QUFBQSxRQUNuRDtBQUFBLFFBQ0EsV0FBVyxjQUFjLElBQUksSUFBSSxpQkFBaUIsd0NBQWUsQ0FBQztBQUFBLFFBQ2xFLDZCQUE2QjtBQUFBLFVBQzNCLElBQUksSUFBSSwrQkFBK0Isd0NBQWU7QUFBQSxRQUN4RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJVbm9DU1MiLCAidnVlSnN4IiwgImZzIiwgIm1kIiwgInBhdGgiLCAidGVtcGxhdGVzIiwgImZzIiwgInBhdGgiLCAiVW5vQ1NTIiwgInZ1ZUpzeCJdCn0K
