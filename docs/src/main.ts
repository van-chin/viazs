import "@/assets/styles/index.less";

import "uno.css";

import "overlayscrollbars/overlayscrollbars.css";

import "iconify-icon";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

import { router, setupRouter } from "@/router";
import { setupRouterGuard } from "@/router/guards";

import { registerGlobComponent } from "@/components";

(async function bootstrap() {
  // if(window)

  const app = createApp(App);

  registerGlobComponent(app);

  setupRouter(app);

  setupRouterGuard(router);

  await app.mount("#app");
})();
