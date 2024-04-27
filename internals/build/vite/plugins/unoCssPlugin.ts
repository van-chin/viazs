import type { PluginOption } from "vite";
import UnoCSS from "unocss/vite";
import { presetExtra } from "unocss-preset-extra";

export function configUnoCss(): PluginOption[] {
	const plugins: PluginOption[] = [];

	plugins.push(
		UnoCSS({
			presets: [presetExtra()],
		})
	);

	return plugins;
}
