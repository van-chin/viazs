<template>
  <div :class="prefixCls">
    <a-checkbox v-model:checked="modelChecked" v-bind="$attrs" >{{ checkboxLabel }}</a-checkbox>
    <a-input v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked" ></a-input>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxInputProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-input");

const COMPONENT_NAME = "VzCheckboxInput";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzCheckboxInputProps>(), {});
const modelValue = defineModel<string>("value",{});
const modelChecked = defineModel<boolean>("checked",{default:false});

const { checkboxLabel  } = toRefs(props);

</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-input";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 4px;

}
</style>
