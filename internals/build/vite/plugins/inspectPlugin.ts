


import type { PluginOption } from "vite";

import Inspect from 'vite-plugin-inspect';

export function configInspect(): PluginOption[] {
  const plugins: PluginOption[] = [];

  plugins.push(
    Inspect()
  );
  return plugins;
}
