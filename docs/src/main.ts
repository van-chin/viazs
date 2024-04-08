import "@/assets/styles/index.less";

import "uno.css";

import "overlayscrollbars/overlayscrollbars.css";

import "iconify-icon";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

import { router, setupRouter } from "@/router";
import { setupRouterGuard } from "@/router/guards";
import { setupStore } from "@/stores";

import { registerGlobComponent } from "@/components";

(async function bootstrap() {
  // if(window)

  const app = createApp(App);

  setupStore(app);

  registerGlobComponent(app);

  setupRouter(app);

  setupRouterGuard(router);

  await app.mount("#app");
})();
