<template>
  <div :class="prefixCls">icon-picker</div>
</template>

<script lang="ts" setup>
import type { IconPickerProps } from "@viaz/types";
import { useStyle } from "@viaz/hooks";
const COMPONENT_NAME = "VzIconPicker";
defineOptions({
  name: COMPONENT_NAME,
});

withDefaults(defineProps<IconPickerProps>(), {
  height: () => 400,
});
const { prefixCls } = useStyle("icon-picker");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-icon-picker";

.@{prefix-cls} {
  border: 1px dashed gray;
  --at-apply: p-2 mb-2;
  overflow: auto;
}
</style>
