import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import antdv from "ant-design-vue";

import viaz from "viaz";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(antdv);

app.use(viaz);

app.mount("#app");
