import type { App } from "vue";

import viaz from "viaz/index";

// import {
// 	Space,
// 	Divider,
// 	Typography,
// 	Anchor,
// 	Menu,
// 	Button,
// 	Dropdown,
// 	Drawer,
// } from "ant-design-vue";

import antdv from "ant-design-vue";

import { Icon } from "@iconify/vue";

import Snippet from "./snippet.vue";
import DocPage from "./DocPage.vue";

export function registerGlobComponent(app: App) {
	app.use(antdv);

	// console.info("viaz =>", viaz);

	// a-typography-title

	// app.use(Typography);
	// app.use(Menu);
	// app.use(Button);
	// app.use(Dropdown);
	// app.use(Drawer);

	// app.component(Anchor.name, Anchor);
	// app.component(Space.name, Space);
	// app.component(Divider.name, Divider);
	app.component("Icon", Icon);
	app.use(viaz);
	app.component("VzSnippet", Snippet);
	app.component("DocPage", DocPage);
}
