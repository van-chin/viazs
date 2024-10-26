import type { PluginOption } from "vite";
import Vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { configUnoCss } from "./plugins/unoCssPlugin";

import { configMkcert } from "./plugins/mkcertPlugin";

import { configVisualizer } from "./plugins/visualizerPlugin";

import { configSvgLoader } from "./plugins/svgLoaderPlugin";

import { configDts } from "./plugins/dtsPlugin";
import { configInspect } from "./plugins/inspectPlugin";

export * from "./preprocessor/less";

export * from "./proxy";

export { configMkcert };

export function configVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
	const vitePlugins: (PluginOption | PluginOption[])[] = [
		Vue({
			include: [/\.(vue|md)$/],
			script: {
				propsDestructure: true,
			},
		}),
		vueJsx(),
	];
	if (!isBuild) {
		vitePlugins.push(configMkcert(viteEnv));
	}

	vitePlugins.push(configInspect());

	vitePlugins.push(configUnoCss());

	vitePlugins.push(configDts());

	vitePlugins.push(configSvgLoader());

	if (isBuild) {
		vitePlugins.push(configVisualizer());
	}

	return vitePlugins as PluginOption[];
}
