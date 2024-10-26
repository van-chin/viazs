import type {
  ConfigProviderProps,
  Theme,
} from "ant-design-vue/lib/config-provider";

import type { App, Plugin } from "vue";

import ConfigProvider from "ant-design-vue/es/config-provider";
import { INSTALLED_KEY } from "@viaz/constants";
import { version } from "./version";

export const makeInstaller = (
  components: Plugin[] = [],
  directives: DirectiveCollections = {}
) => {
  const install = (
    app: App,
    options?: ConfigProviderProps & {
      theme?: Theme;
    }
  ) => {
    // @ts-ignore
    if (app[INSTALLED_KEY]) return;
    // @ts-ignore
    app[INSTALLED_KEY] = true;

    components.forEach((component) => app.use(component));

    // console.info("directives =>", directives);

    // 注册指令
    Object.keys(directives).forEach((key) => {
      console.info("register.key =>", key);
      app.directive(key, directives[key]);
    });

    if (options) ConfigProvider.config(options);
  };

  return {
    version,
    install,
  };
};
