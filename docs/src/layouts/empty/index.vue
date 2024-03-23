<template>
  <div :class="prefixCls"></div>
</template>

<script lang="ts" setup>
import { useStyle } from "viaz";

const { prefixCls } = useStyle("component-name");

const COMPONENT_NAME = "VzComponentName";
defineOptions({
  name: COMPONENT_NAME,
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-component-name";

.@{prefix-cls} {
}
</style>
