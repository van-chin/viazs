<template>
  <div :class="prefixCls">
    <slot></slot>

    <div :class="`${prefixCls}-mask`">
      <div :class="`${prefixCls}-mask-contents`">
        <slot name="mask"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VzHoverMaskProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("hover-mask");

const COMPONENT_NAME = "VzHoverMask";
defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzHoverMaskProps>(), {});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-hover-mask";

.@{prefix-cls} {
  --at-apply: w-full h-full;
  position: relative;

  &:hover &-mask {
    display: block;
  }

  &-mask {
    --at-apply: w-full h-full;
    display: none;
    position: absolute;
    top: 0;
    left: 0;

    &-contents {
      --at-apply: w-full h-full flex justify-center items-center;
      background-color: rgba(35, 35, 36, 0.7);
      backdrop-filter: blur(1px);
    }
  }
}
</style>
