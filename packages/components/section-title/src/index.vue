<template>
  <div :class="prefixCls">
    <a-typography-text strong><slot></slot></a-typography-text>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

const COMPONENT_NAME = "VzSectionTitle";
defineOptions({
  name: COMPONENT_NAME,
});

const { prefixCls } = useStyle("section-title");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-section-title";

.@{prefix-cls} {
  --at-apply: w-full my-1;
}
</style>
