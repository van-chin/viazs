import type { AppRouteModule } from "@/router/types";
import { DEFAULT_LAYOUT } from "@/router/constant";

const preffix = "/components";

const components: AppRouteModule = {
  path: `${preffix}`,
  name: "ms",
  component: DEFAULT_LAYOUT,
  redirect: "/components/overview",
  meta: {
    hideChildrenInMenu: true,
    icon: "simple-icons:about-dot-me",
    title: "dashboard.analysis",
    orderNo: 999,
  },
  children: [
    {
      path: "overview",
      name: "components.overview",
      component: () => import("@/views/modules/components/index.vue"),
      meta: {
        title: "components.index",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "button",
      name: "components.button",
      component: () => import("@viaz/components/button/demos/index.demo.md"),
      meta: {
        title: "components.button",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "select",
      name: "components.select",
      component: () => import("@viaz/components/select/demos/index.demo.md"),
      meta: {
        title: "components.button",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "table",
      name: "components.table",
      component: () => import("@viaz/components/table/demos/index.demo.md"),
      meta: {
        title: "components.button",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "list-checkbox-group",
      name: "components.list-checkbox-group",
      component: () =>
        import("@viaz/components/list-checkbox-group/demos/index.demo.md"),
      meta: {
        title: "components.button",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "form-designer",
      name: "components.form-designer",
      component: () =>
        import("@viaz/components/form-designer/demos/index.demo.md"),
      meta: {
        title: "components.form-designer",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "form-renderer",
      name: "components.form-renderer",
      component: () =>
        import("@viaz/components/form-renderer/demos/index.demo.md"),
      meta: {
        title: "components.form-renderer",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "table",
      name: "components.table",
      component: () => import("@viaz/components/table/demos/index.demo.md"),
      meta: {
        title: "components.form-renderer",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "form-table",
      name: "components.form-table",
      component: () =>
        import("@viaz/components/form-table/demos/index.demo.md"),
      meta: {
        title: "components.form-table",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "dynamic-panel",
      name: "components.dynamic-panel",
      component: () =>
        import("@viaz/components/dynamic-panel/demos/index.demo.md"),
      meta: {
        title: "components.dynamic-panel",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "hover-mask",
      name: "components.hover-mask",
      component: () =>
        import("@viaz/components/hover-mask/demos/index.demo.md"),
      meta: {
        title: "components.hover-mask",
        icon: "simple-icons:about-dot-me",
      },
    },

    {
      path: "configuration-value",
      name: "components.configuration-value",
      component: () =>
        import("@viaz/components/configuration-value/demos/index.demo.md"),
      meta: {
        title: "components.configuration-value",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "checkbox-input",
      name: "components.checkbox-input",
      component: () =>
        import("@viaz/components/checkbox-input/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-input",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "checkbox-input-number",
      name: "components.checkbox-input-number",
      component: () =>
        import("@viaz/components/checkbox-input-number/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-input-number",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "checkbox-group-input",
      name: "components.checkbox-group-input",
      component: () =>
        import("@viaz/components/checkbox-group-input/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-group-input",
        icon: "simple-icons:about-dot-me",
      },
    },
    {
      path: "checkbox-group",
      name: "components.checkbox-group",
      component: () =>
        import("@viaz/components/checkbox-group/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-group",
        icon: "simple-icons:about-dot-me",
      },
    },

    {
      path: "checkbox-date-picker",
      name: "components.checkbox-date-picker",
      component: () =>
        import("@viaz/components/checkbox-date-picker/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-date-picker",
        icon: "simple-icons:about-dot-me",
      },
    },

    {
      path: "checkbox-date-range-picker",
      name: "components.checkbox-date-range-picker",
      component: () =>
        import("@viaz/components/checkbox-date-range-picker/demos/index.demo.md"),
      meta: {
        title: "components.checkbox-date-range-picker",
        icon: "simple-icons:about-dot-me",
      },
    },


  
  ],
};

export default components;
