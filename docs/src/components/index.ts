import type { App } from "vue";

import viaz from "viaz/index";

// import antdv from "ant-design-vue";
import { Space,Divider,Typography,Anchor,Menu,Button,Dropdown } from "ant-design-vue";
import { Icon } from "@iconify/vue";

import Snippet from "./snippet.vue";
import DocPage from "./DocPage.vue";

export function registerGlobComponent(app: App) {
  // app.use(antdv);

  // console.info("viaz =>", viaz);


  // a-typography-title

  app.use(Typography);
  app.use(Menu);
  app.use(Button);
  app.use(Dropdown);

  app.component(Anchor.name, Anchor);
  app.component(Space.name, Space);
  app.component(Divider.name, Divider);
  app.component("Icon", Icon);
  app.use(viaz);
  app.component("VzSnippet", Snippet);
  app.component("DocPage", DocPage);
}
