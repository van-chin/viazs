<template>
  <div :class="prefixCls">editor</div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

const COMPONENT_NAME = "VzEditor";
defineOptions({
  name: COMPONENT_NAME,
});

const { prefixCls } = useStyle("editor");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-editor";

.@{prefix-cls} {
  border: 1px solid #ccc;
  --at-apply: w-full;
}
</style>
