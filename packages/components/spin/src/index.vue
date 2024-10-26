<template>
  <div :class="prefixCls">
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

const COMPONENT_NAME = "VzSpin";
defineOptions({
  name: COMPONENT_NAME,
});

const { prefixCls } = useStyle("spin");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-spin";

.@{prefix-cls} {
  --at-apply: w-full h-full flex justify-center items-center;
}
</style>
