import type { PluginOption } from "vite";

import dts from "vite-plugin-dts";

export function configDts(): PluginOption[] {
  const plugins: PluginOption[] = [];

  plugins.push(
    dts({
      insertTypesEntry: true,
      // rollupTypes: true,
      // exclude: ["dist", "dist/**", "node_modules/**"],
    })
  );
  return plugins;
}
