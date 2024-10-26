import type { AppRouteModule } from "@/router/types";
import { DEFAULT_LAYOUT } from "@/router/constant";

const preffix = "/tests";

const tests: AppRouteModule = {
	path: `${preffix}`,
	name: "tests",
	component: DEFAULT_LAYOUT,
	redirect: "/tests/index",
	meta: {
		hideChildrenInMenu: true,
		icon: "simple-icons:about-dot-me",
		title: "dashboard.analysis",
		orderNo: 999,
	},
	children: [
		{
			path: "index",
			name: "tests.index",
			component: () => import("@/views/modules/tests/index.vue"),
			meta: {
				title: "tests.index",
				icon: "simple-icons:about-dot-me",
			},
		},
	],
};

export default tests;
