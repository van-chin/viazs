import type { App } from "vue";

import viaz from "viaz/index";

import antdv from "ant-design-vue";
import { Icon } from "@iconify/vue";

import Snippet from "./snippet.vue";
import DocPage from "./DocPage.vue";

export function registerGlobComponent(app: App) {
  app.use(antdv);

  // console.info("viaz =>", viaz);

  app.use(viaz);

  app.component("Icon", Icon);
  app.component("VzSnippet", Snippet);
  app.component("DocPage", DocPage);
}
