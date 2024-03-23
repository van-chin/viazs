import type { PluginOption } from "vite";

import svgLoader from "vite-svg-loader";
// svgLoaderPlugin

export function configSvgLoader(): PluginOption[] {
  const plugins: PluginOption[] = [];

  plugins.push(svgLoader());
  return plugins;
}
