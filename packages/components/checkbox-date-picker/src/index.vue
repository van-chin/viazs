<template>
  <div :class="prefixCls">
    <a-checkbox v-model:checked="modelChecked" v-bind="$attrs" @change="onCheckboxChange">{{ checkboxLabel
      }}</a-checkbox>
    <a-date-picker v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked"></a-date-picker>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxDatePickerProps } from "@viaz/types";
import type { Dayjs } from 'dayjs';
import { useStyle } from "@viaz/hooks";
import { toRefs } from "vue";

const { prefixCls } = useStyle("checkbox-date-picker");

const COMPONENT_NAME = "VzCheckboxDatePicker";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzCheckboxDatePickerProps>(), {});
const modelChecked = defineModel<boolean>("checked", { default: false });

const modelValue = defineModel<Dayjs>("value", {});


const { checkboxLabel } = toRefs(props);

const onCheckboxChange = (event: Event) => {
  if (event.target?.checked === false) {
    modelValue.value = undefined;
  }
}

</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-date-picker";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 4px;

}
</style>
