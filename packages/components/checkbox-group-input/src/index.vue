<template>
  <div :class="prefixCls">

    <vz-checkbox-group v-model:value="modelChecked" v-bind="$attrs" :max="1"
      @change="onCheckboxGroupChange"></vz-checkbox-group>
    <a-input v-model:value="modelValue" v-bind="$attrs" :disabled="!modelChecked.length"></a-input>
  </div>
</template>

<script lang="ts" setup>

import type { VzCheckboxGroupInputProps, CheckboxValue } from "@viaz/types";
import type { CheckboxGroupProps } from "ant-design-vue/es/checkbox";
import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("checkbox-group-input");

const COMPONENT_NAME = "VzCheckboxGroupInput";

defineOptions({
  name: COMPONENT_NAME,
});


const props = withDefaults(defineProps<VzCheckboxGroupInputProps>(), {});

const emits = defineEmits<{
  checkboxGroupChange: [checkedValue: CheckboxValue[]]
}>();

const modelChecked = defineModel("checked", { default: [] });

const modelValue = defineModel<string>("value", {});

const onCheckboxGroupChange: CheckboxGroupProps["onChange"] = (checkedValue) => {
  emits('checkboxGroupChange', checkedValue);
}


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
