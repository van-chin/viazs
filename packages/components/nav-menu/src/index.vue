<template>
  <a-menu style="width: 100%" :class="prefixCls" v-bind="$attrs">
    <nav-menu-item
      v-for="(item, index) in data"
      :data="item"
      :fieldNames="fieldNames"
      :key="item[fieldNames.value]"
      :bread-crumb="breadCrumb"
      :currentIndex="breadCrumb ? index : undefined"
    ></nav-menu-item>
  </a-menu>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import { NavMenuProps } from "@viaz/types";
import NavMenuItem from "./nav-menu-item.vue";

const { prefixCls } = useStyle("nav-menu");

const COMPONENT_NAME = "VzNavMenu";
defineOptions({
  name: COMPONENT_NAME,
});

const {
  fieldNames = {
    children: "children",
    label: "label",
    value: "value",
    icon: "icon",
    leaf: "leaf",
    disabled: "disabled",
    level: "level",
  },
  breadCrumb,
  data = [],
} = defineProps<NavMenuProps>();
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-nav-menu";

.@{prefix-cls} {
  // border: 1px solid red;
}
</style>
