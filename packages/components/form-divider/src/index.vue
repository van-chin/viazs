<template>
  <div :class="prefixCls">
    <span class="font-italic">{{ title }}</span>
  </div>
</template>
<script lang="ts" setup>
import type { VzFormDividerProps } from "@viaz/types";

import { computed, toRefs } from "vue";

import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("form-divider");
const COMPONENT_NAME = "VzFormDivider";
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<VzFormDividerProps>();

const {
  title = "",
  dashed = true,
  width = 1,
  borderColor = "#d9d9d9",
} = toRefs(props);

const borderBottomStyle = computed(() => {
  return dashed.value ? "dashed" : "solid";
});

const borderWidth = computed(() => {
  return `${width.value}px`;
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-form-divider";

.@{prefix-cls} {
  --at-apply: w-full py-1;
  border-bottom: v-bind(borderWidth) v-bind(borderBottomStyle)
    v-bind(borderColor);
}
</style>
