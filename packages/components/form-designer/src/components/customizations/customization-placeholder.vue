<template>
  <div :class="prefixCls">
    <a-space>
      <template v-for="(item, index) in modelValue">
        <a-input
          :placeholder="item || `占位符${index + 1}`"
          v-model:value="modelValue[index]"
        >
          <template #prefix>
            <span class="text-#0000004f text-10px">#{{ index + 1 }}</span>
          </template>
        </a-input>
      </template>
    </a-space>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

const COMPONENT_NAME = "VzDesignerCustomizationPlaceholder";
//
defineOptions({
  name: COMPONENT_NAME,
});
interface VzDesignerCustomizationPlaceholderProps {
  /**  类型 */
  options?: [];
}

defineProps<VzDesignerCustomizationPlaceholderProps>();
const { prefixCls } = useStyle("designer-customization-placeholder");

const modelValue = defineModel<string[]>("value", {
  default: ["占位符#1", "占位符#2"],
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-placeholder";

.@{prefix-cls} {
  --at-apply: w-full
  &-item {
    background-color: #fff;
    --at-apply: "mb-2";
  }
}
</style>
