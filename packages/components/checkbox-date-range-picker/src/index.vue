<template>
  <div :class="prefixCls">
    <a-checkbox v-model:checked="modelChecked" v-bind="$attrs" @change="onCheckboxChange">{{ checkboxLabel }}</a-checkbox>
    <a-range-picker v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked" ></a-range-picker>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxDateRangePickerProps,DateRangeValue } from "@viaz/types";


import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-date-range-picker");

const COMPONENT_NAME = "VzCheckboxDateRangePicker";

defineOptions({
  name: COMPONENT_NAME,
});

const emits = defineEmits<{
  checkboxChange: [checked: boolean]
}>();

const props = withDefaults(defineProps<VzCheckboxDateRangePickerProps>(), {});
const modelValue = defineModel<DateRangeValue>("value",{});
const modelChecked = defineModel<boolean>("checked",{default:false});

const { checkboxLabel  } = toRefs(props);


const onCheckboxChange = (event: Event) => {
  if (event.target?.checked === false) {
    modelValue.value = [];
  }
  emits('checkboxChange',event.target.checked);
}

</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-date-range-picker";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 4px;

}
</style>
