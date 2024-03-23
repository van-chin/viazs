<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-header`">
      <div class="flex items-center">
        <iconify-icon
          icon="devicon:antdesign"
          class="text-6 mr-2"
        ></iconify-icon>

        VIAZ
      </div>
      <div class="flex items-center">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          class="header-nav-menu"
        />

        <a-dropdown class="ml-2">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">5.14.1</a-menu-item>
              <a-menu-item key="2">4.x</a-menu-item>
              <a-menu-item key="3">3.x</a-menu-item>
              <a-menu-item key="4">2.x</a-menu-item>
              <a-menu-item key="5">1.x</a-menu-item>
              <a-menu-item key="6">0.x</a-menu-item>
            </a-menu>
          </template>
          <a-button>
            <div class="flex items-center">
              5.14.1
              <iconify-icon
                icon="ant-design:down-outlined"
                style="vertical-align: -0.125em"
              ></iconify-icon>
            </div>
          </a-button>
        </a-dropdown>
      </div>
    </div>

    <div :class="`${prefixCls}-contents`">
      <OverlayScrollbarsComponent
        ref="scrollbarRef"
        class="overlayscrollbars-vue h-full"
        :options="{
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 1,
          },
        }"
        defer
      >
        <a-menu
          id="dddddd"
          style="width: 256px"
          mode="inline"
          :items="componentItems"
          @click="onComponentMenuClick"
        ></a-menu>
      </OverlayScrollbarsComponent>
      <overlay-scrollbars-component
        class="overlayscrollbars-vue h-full flex-1 p-2"
        :options="{
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 1,
          },
        }"
        defer
      >
        <router-view></router-view>
      </overlay-scrollbars-component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStyle } from "viaz";

import { reactive, ref, watch, VueElement, h } from "vue";

import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const { prefixCls } = useStyle("default-layout");

const COMPONENT_NAME = "DefaultLayout";
defineOptions({
  name: COMPONENT_NAME,
});

import type { MenuProps, ItemType } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const current = ref<string[]>(["mail"]);
const items = ref<MenuProps["items"]>([
  {
    key: "mail",

    label: "设计",
    title: "Navigation One",
  },
  {
    key: "app",

    label: "研发",
    title: "Navigation Two",
  },
  {
    key: "components",

    label: "组件",
    title: "Navigation Two",
  },
  {
    key: "blogs",

    label: "博客",
    title: "Navigation Two",
  },
]);

const onComponentMenuClick: MenuProps["onClick"] = ({ item, key, keyPath }) => {
  console.info("onComponentMenuClick.item =>", item);
  console.info("onComponentMenuClick.key =>", key);
  console.info("onComponentMenuClick.keyPath =>", keyPath);

  router.push({ path: `/components/${key}` });
};

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: "group"
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const componentItems: ItemType[] = reactive([
  getItem("组件总览", "overview"),

  getItem(
    "通用",
    "grp",
    null,
    [
      getItem("Button 按钮", "button"),
      getItem("FloatButton 悬浮按钮", "float-button"),
      getItem("Icon 图标", "icon"),
      getItem("Typography 排版", "typography"),
    ],
    "group"
  ),

  //

  getItem(
    "布局",
    "grp",
    null,
    [
      getItem("DynamicPanel 动态面板", "dynamic-panel"),
      getItem("FloatButton 悬浮按钮", "float-button"),
      getItem("Icon 图标", "icon"),
      getItem("Typography 排版", "typography"),
    ],
    "group"
  ),

  getItem(
    "导航",
    "grp",
    null,
    [
      getItem("Button 按钮", "button"),
      getItem("FloatButton 悬浮按钮", "float-button"),
      getItem("Icon 图标", "icon"),
      getItem("Typography 排版", "typography"),
    ],
    "group"
  ),

  getItem(
    "数据录入",
    "grp",
    null,
    [
      getItem("Select 选择框", "select"),
      getItem("ListCheckboxGroup 列表多选框组", "list-checkbox-group"),
      getItem("FormDesigner 表单设计器", "form-designer"),
      getItem("FormRenderer 表单渲染器", "form-renderer"),
      getItem("FormTable 表单表格", "form-table"),
      getItem("ConfigurationValue 配置值", "configuration-value"),
    ],
    "group"
  ),

  getItem(
    "数据展示",
    "grp",
    null,
    [
      getItem("Table 表格", "table"),
      getItem("FloatButton 悬浮按钮", "float-button"),
      getItem("Icon 图标", "icon"),
      getItem("Typography 排版", "typography"),
    ],
    "group"
  ),

  getItem(
    "反馈",
    "grp",
    null,
    [
      getItem("Button 按钮", "button"),
      getItem("FloatButton 悬浮按钮", "float-button"),
      getItem("Icon 图标", "icon"),
      getItem("Typography 排版", "typography"),
    ],
    "group"
  ),

  getItem(
    "其他",
    "grp",
    null,
    [getItem("HoverMask 悬停遮罩", "hover-mask")],
    "group"
  ),
]);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-default-layout";

.@{prefix-cls} {
  --at-apply: w-full h-full flex flex-col;

  .ant-menu-horizontal {
    border-bottom: 1px solid transparent;
  }

  &-header {
    --at-apply: flex flex-row flex-justify-between items-center px-4 h-64px;

    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1000;
    max-width: 100%;
    background: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }

  &-contents {
    --at-apply: w-full flex flex-1;
    height: calc(100% - 64px);
    // overflow: hidden;
  }
}
</style>
