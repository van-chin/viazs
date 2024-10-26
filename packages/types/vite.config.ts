import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import dts from "vite-plugin-dts";
export default defineConfig({
	build: {
		lib: {
			entry: "./index.ts",
			name: "types",
		},
		minify: false,
	},
	plugins: [
		Vue({
			script: {
				propsDestructure: true,
			},
		}),
		vueJsx(),
		// dts({
		//   rollupTypes: false,
		//   insertTypesEntry: true,
		//   declarationOnly: true,
		//   exclude: [
		//     "node_modules/**",
		//     "../../build/**",
		//     "../apis/**",

		//     "../components/**",
		//     "../constants/**",
		//     "../enums/**",
		//     "../hooks/**",
		//     "../themes/**",
		//     "../utils/**",
		//     "../../play/**",
		//   ],
		// }),
	],
});
