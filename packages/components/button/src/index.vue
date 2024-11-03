<template>
  <a-button v-bind="$attrs" :class="[prefixCls, { gapless: props.gapless }]">
    <template #icon v-if="props.icon">
      <span :class="`${prefixCls}-icon mr-1`">
        <iconify-icon :icon="props.icon" :inline="true"></iconify-icon>
      </span>
    </template>

    <template v-if="props.text">{{ props.text }}</template>
    <slot v-else></slot>
  </a-button>
</template>

<script lang="ts" setup>
import type { VzButtonProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("button");

const COMPONENT_NAME = "VzButton";
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<VzButtonProps>();

</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-button";

.@{prefix-cls}.gapless {
  padding: 0 2px;
}
</style>
