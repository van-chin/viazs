<template>
  <div :class="prefixCls">
    <vz-overlay-scrollbar>
      <a-typography-text strong>{{ title }}</a-typography-text>
      <vue-json-pretty v-bind="$attrs" />
    </vz-overlay-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { VzJsonViewerProps } from "@viaz/types";
import { useStyle } from "@viaz/hooks";
const COMPONENT_NAME = "VzJsonViewer";
defineOptions({
  name: COMPONENT_NAME,
});

withDefaults(defineProps<VzJsonViewerProps>(), {});
const { prefixCls } = useStyle("json-viewer");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-json-viewer";

.@{prefix-cls} {
  border: 1px dashed gray;
  --at-apply: h-full w-full py-2 pl-2 mb-2;
}
</style>
