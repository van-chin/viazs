<template>
  <div :class="prefixCls">
    <div class="w-full">components overview</div>
  </div>
</template>

<script lang="ts" setup>
import { useStyle } from "viaz";

const { prefixCls } = useStyle("components");

const COMPONENT_NAME = "Components";
defineOptions({
  name: COMPONENT_NAME,
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-components";

.@{prefix-cls} {
  --at-apply: w-full h-full;
}
</style>
