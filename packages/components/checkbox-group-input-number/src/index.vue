<template>
  <div :class="prefixCls">
    
    <vz-checkbox-group  v-model:value="modelChecked" v-bind="$attrs" :max="1"></vz-checkbox-group>
    <a-input-number v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked.length" ></a-input-number>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxGroupInputNumberProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-group-input-number");

const COMPONENT_NAME = "VzCheckboxGroupInputNumber";

defineOptions({
  name: COMPONENT_NAME,
});


const props = withDefaults(defineProps<VzCheckboxGroupInputNumberProps>(), {});

const modelChecked = defineModel("checked",{default:[]});

const modelValue = defineModel<string>("value", {});


</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-group-input-number";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 4px;

}
</style>
