<template>
  <div :class="prefixCls">
    <VzDesignerCustomizationPropHeader
      v-bind="$attrs"
      :visible-toggler="visibilityToggler"
      v-model:visible="modelVisible"
      :apply="modelApply"
      :apply-toggler="applyToggler"
      @apply-change="onApplyChange"
    ></VzDesignerCustomizationPropHeader>
    <div :class="`${prefixCls}-content`" v-show="modelVisible">
      <template v-if="needEmitEvent">
        <component
          :is="calcUseComponent"
          v-bind="component.props || {}"
          v-model:[component.vModelField]="modelValue"
          :mode="$attrs.mode"
          @focus="onComponentFocus"
          @change="onComponentChange"
          @blur="onComponentBlur"
        ></component>
      </template>
      <template v-else>
        <component
          :is="calcUseComponent"
          v-bind="component.props || {}"
          v-model:[component.vModelField]="modelValue"
          v-model:params="modelParams"
          v-model:api="modelApi"
          :mode="$attrs.mode"
        ></component>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

import type { Component } from "vue";
import { useAttrs, computed, toRefs } from "vue";
import VzDesignerCustomizationPropHeader from "./customization-prop-header.vue";

import VzDesignerCustomizationEvents from "./customization-events.vue";
import VzDesignerCustomizationFieldNames from "./customization-field-names.vue";
import VzDesignerCustomizationOptions from "./customization-options.vue";
import VzDesignerCustomizationRules from "./customization-rules.vue";
import VzDesignerCustomizationPlaceholder from "./customization-placeholder.vue";
import VzDesignerCustomizationPropValue from "./customization-prop-value.vue";
import VzDesignerCustomizationObject from "./customization-object.vue";

import VzDesignerCustomizationColumns from "./customization-columns.vue";

const COMPONENT_NAME = "VzDesignerCustomizationProp";
defineOptions({
  name: COMPONENT_NAME,
});

interface VzDesignerCustomizationPropProps {
  /**  类型 */
  type?: string;
  /** 组件 */
  component: Record<string, any>;
  /** 显隐切换器 */
  visibilityToggler?: boolean;
  /** 应用开关 */
  applyToggler?: boolean;
}

// props 配置组件 activeComponent.component
const customizationPropComponents: Record<string, Component> = {
  VzDesignerCustomizationEvents,
  VzDesignerCustomizationFieldNames,
  VzDesignerCustomizationOptions,
  VzDesignerCustomizationRules,
  VzDesignerCustomizationPlaceholder,
  VzDesignerCustomizationPropValue,
  VzDesignerCustomizationObject,
  VzDesignerCustomizationColumns,
};

const props = defineProps<VzDesignerCustomizationPropProps>();

const {
  visibilityToggler = false,
  applyToggler = false,
  component = {
    name: "AInput",
    vModelField: "value",
    props: {
      placeholder: "请输入占位提示",
    },
  },
} = toRefs(props);

const attrs = useAttrs();

const emits = defineEmits<{
  modelNameFocus: [field: string, value: string];
  /** model name change */
  modelNameChange: [field: string, value: string];
  /** blur */
  modelNameBlur: [field: string, value: string];
}>();

const { prefixCls } = useStyle("designer-customization-prop");

const calcUseComponent = computed(() => {
  return Object.prototype.hasOwnProperty.call(
    customizationPropComponents,
    component.value.name
  )
    ? customizationPropComponents[component.value.name]
    : component.value.name;
});

const modelVisible = defineModel<boolean>("visible", {
  default: true,
});

const modelValue = defineModel("value");

const modelApply = defineModel<boolean>("apply", {
  default: false,
});

const modelApi = defineModel<object>("api", {
  default: {},
});

const modelParams = defineModel<object[]>("params", {
  default: [],
});

const onApplyChange = (apply: any) => {
  modelApply.value = apply;
};

const needEmitEvent = computed(() => {
  return (
    (attrs.field === "name" || attrs.field === "labelCol.style.width") &&
    component.value.name === "AInput"
  );
});

const onComponentFocus = () => {
  emits("modelNameFocus", attrs.field as string, modelValue.value as string);
};

const onComponentChange = () => {
  setTimeout(() => {
    emits("modelNameChange", attrs.field as string, modelValue.value as string);
  }, 10);
};

const onComponentBlur = () => {
  setTimeout(() => {
    emits("modelNameChange", attrs.field as string, modelValue.value as string);
  }, 10);
};
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-prop";

.@{prefix-cls} {
  --at-apply: w-full;
  &-header {
    --at-apply: "flex justify-between items-center mb-1";
  }
  &-content {
    --at-apply: w-full px-1;
    // background-color: #eeeeee;
    // border: 1px solid red;
  }
}
</style>
