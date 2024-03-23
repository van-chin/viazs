<template>
  <div :class="prefixCls">
    <vz-button text="sss">ssvvv</vz-button>
  </div>
</template>

<script lang="ts" setup>
import { useStyle } from "viaz";

const { prefixCls } = useStyle("button");

const COMPONENT_NAME = "button";
defineOptions({
  name: COMPONENT_NAME,
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-button";

.@{prefix-cls} {
  --at-apply: w-full h-full;
}
</style>
