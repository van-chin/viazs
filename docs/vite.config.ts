import type { UserConfig, ConfigEnv, PluginOption } from "vite";

import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import { resolve } from "node:path";

import UnoCSS from "unocss/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";

import Inspect from "vite-plugin-inspect";
// import createVuePlugin from "@vitejs/plugin-vue";

import vue from "@vitejs/plugin-vue";

import vitePluginMarkdown from "./plugins/vite-plugin-md";

import {
	configVitePlugins,
	getLessOptions,
	wrapperEnv,
	createProxy,
	configMkcert,
} from "../internals/build";

// https://vitejs.dev/config/
export default ({ mode, command }: ConfigEnv): UserConfig => {
	const root = process.cwd();
	const env = loadEnv(mode, root);
	const viteEnv = wrapperEnv(env);

	const {
		VITE_PORT,
		VITE_PUBLIC_PATH,
		VITE_DROP_CONSOLE,
		VITE_PROXY,
		// VITE_USE_SERVER_HTTPS,
	} = viteEnv;

	const isBuild = command === "build";

	// console.info('VITE_PROXY =>', VITE_PROXY);

	// let plugins: PluginOption[] = configVitePlugins(
	//   viteEnv,
	//   isBuild
	// ) as PluginOption[];

	// plugins.push(vitePluginMarkdown());

	// console.info("plugins =>", plugins);

	// console.info(JSON.stringify(mode === 'development'));
	return {
		base: VITE_PUBLIC_PATH,
		root: root,

		plugins: [
			vitePluginMarkdown(),
			UnoCSS(),
			vue({
				include: [/\.(vue|md)$/],
				script: {
					defineModel: true,
				},
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.includes("iconify"),
					},
				},
			}),
			vueJsx(),
			Inspect(),
			configMkcert(viteEnv),
		],
		define: {
			__IS_DEVELOPMENT__: JSON.stringify(mode === "development"),
		},

		worker: {
			format: "es",
		},

		build: {
			lib: {
				entry: "./index.ts",
				name: "viaz",
				// fileName: "viaz",
			},
			minify: false,
			commonjsOptions: {
				transformMixedEsModules: true,
				strictRequires: true, // 注意：这里必须是 true，否则会报错
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
					"vue-draggable-plus",
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
			proxy: createProxy(VITE_PROXY),
		},
		css: {
			preprocessorOptions: {
				less: getLessOptions(isBuild, "../"),
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
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				viaz: fileURLToPath(
					new URL("../packages/viaz", import.meta.url)
				),
				"viaz/index": fileURLToPath(
					new URL("../packages/viaz/index", import.meta.url)
				),
				"@viaz/*": fileURLToPath(
					new URL("../packages/*", import.meta.url)
				),
				"@packages/components/**/*": fileURLToPath(
					new URL("../packages/components/**/*", import.meta.url)
				),
			},
		},
	};
};
