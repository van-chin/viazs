<template>
  <div :class="prefixCls">
    
    <vz-checkbox-group  v-model:value="modelChecked" v-bind="$attrs" :max="1"></vz-checkbox-group>
    <a-input v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked.length" ></a-input>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxGroupInputProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-group-input");

const COMPONENT_NAME = "VzCheckboxGroupInput";

defineOptions({
  name: COMPONENT_NAME,
});


const props = withDefaults(defineProps<VzCheckboxGroupInputProps>(), {});

const modelValue = defineModel<string>("value", {});

const modelChecked = defineModel("checked");



</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-group-input";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 4px;

}
</style>
