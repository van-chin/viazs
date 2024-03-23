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
    <div>
      <!-- {{ attrs }} -->
      <p>{{ modelValue }}</p>
    </div>
    <div :class="`${prefixCls}-content`" v-show="modelVisible">
      <component
        :is="
          Object.prototype.hasOwnProperty.call(
            customizationPropComponents,
            component.name
          )
            ? customizationPropComponents[component.name]
            : component.name
        "
        v-bind="component.props || {}"
        v-model:[component.vModelField]="modelValue"
        @focus="onComponentFocus"
        @change="onComponentChange"
      ></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";

import type { Component } from "vue";

import { useAttrs } from "vue";

import VzDesignerCustomizationPropHeader from "./customization-prop-header.vue";

import VzDesignerCustomizationEvents from "./customization-events.vue";
import VzDesignerCustomizationFieldNames from "./customization-field-names.vue";
import VzDesignerCustomizationOptions from "./customization-options.vue";
import VzDesignerCustomizationRules from "./customization-rules.vue";

import VzDesignerCustomizationObject from "./customization-object.vue";

const COMPONENT_NAME = "VzDesignerCustomizationPropRule";
defineOptions({
  name: COMPONENT_NAME,
});

interface VzDesignerCustomizationPropRuleProps {
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
  VzDesignerCustomizationObject,
};

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
} = defineProps<VzDesignerCustomizationPropRuleProps>();

const attrs = useAttrs();

const emits = defineEmits<{
  modelNameFocus: [field: string];
  /** model name change */
  modelNameChange: [field: string];
}>();

const { prefixCls } = useStyle("designer-customization-prop-rule");

const modelVisible = defineModel<boolean>("visible", {
  default: true,
});

const modelValue = defineModel("value");

const modelApply = defineModel<boolean>("apply", {
  default: false,
});

const onApplyChange = (apply: any) => {
  modelApply.value = apply;
};

const onComponentFocus = () => {
  if (attrs.field === "name" && component.name === "AInput") {
    emits("modelNameFocus", "name");
  }
};

const onComponentChange = () => {
  if (attrs.field === "name" && component.name === "AInput") {
    emits("modelNameChange", "name");
  }
};
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-prop-rule";

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
