import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

import { presetExtra } from "unocss-preset-extra";

export default defineConfig({
	shortcuts: [
		["wh-full", "w-full h-full"],
		["f-c-c", "flex justify-center items-center"],
		["bd-red", "border-1 border-red border-solid"],
		["bd-green", "border-1 border-green border-solid"],
		["bd-black", "border-1 border-black border-solid"],
	],
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			prefix: "icon-",
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
		presetExtra(),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
