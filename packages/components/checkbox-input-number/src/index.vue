<template>
  <div :class="prefixCls">
    <a-checkbox v-model:checked="modelChecked" v-bind="$attrs" @change="onCheckboxChange" >{{ checkboxLabel }}</a-checkbox>
    <a-input-number v-model:value="modelValue" class="w-full" v-bind="$attrs" :disabled="!modelChecked" ></a-input-number>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxInputNumberProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-input");

const COMPONENT_NAME = "VzCheckboxInputNumber";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzCheckboxInputNumberProps>(), {});

const modelValue = defineModel<string>("value",{});

const modelChecked = defineModel<boolean>("checked",{default:false});

const emits = defineEmits<{
  checkboxChange: [checked: boolean]
}>();


const { checkboxLabel  } = toRefs(props);

const onCheckboxChange = (event: Event) => {
  if (event.target?.checked === false) {
    modelValue.value = undefined;
  }
  emits('checkboxChange',event.target.checked);
}

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
