import type { PluginOption } from "vite";
import UnoCSS from "unocss/vite";

export function configUnoCss(): PluginOption[] {
  const plugins: PluginOption[] = [];

  plugins.push(UnoCSS());

  return plugins;
}
