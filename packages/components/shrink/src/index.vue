<template>
  <div :class="prefixCls"></div>
</template>

<script lang="ts" setup>
import type { VzComponentNameProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("component-name");

const COMPONENT_NAME = "VzComponentName";
defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzComponentNameProps>(), {});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-component-name";

.@{prefix-cls} {
  --at-apply: w-full h-full;
}
</style>
