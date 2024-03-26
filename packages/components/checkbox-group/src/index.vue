<template>
   
    <a-checkbox-group :class="prefixCls" v-bind="$attrs" :options="innerOptions"    @change="onChange"></a-checkbox-group>

</template>

<script lang="ts" setup>

import type { VzCheckboxGroupProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { toRefs, ref } from "vue";

const { prefixCls } = useStyle("checkbox-group");

const COMPONENT_NAME = "VzCheckboxGroup";

defineOptions({
  name: COMPONENT_NAME,
});

const innerOptions = ref<VzCheckboxGroupProps['options']>([]);

type CheckboxGroupValue = string[] | number[];

const props = withDefaults(defineProps<VzCheckboxGroupProps>(), {});

const { options, min, max } = toRefs(props);

(async function initialize() {
  innerOptions.value = options.value;
})();

const onChange = (checkedValue: CheckboxGroupValue) => {
  
  if (max.value) {
    if (checkedValue.length === max.value) {
      innerOptions.value.forEach((option) => {
        option.disabled = !checkedValue.includes(option.value as never);
      });
    }

    if (checkedValue.length < max.value) {
      innerOptions.value.forEach((option) => {
        option.disabled = false;
      });
    }
  }

}



</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-group";

.@{prefix-cls} {
  // --at-apply: w-full h-full;
  border: 1px solid red;

}
</style>
