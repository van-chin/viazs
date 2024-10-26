<template>
  <div :class="prefixCls">
    <a-space :size="3">
      <div v-if="modelVisibleToggler === true">
        <icon
          @click="toggleShowContent"
          :icon="`ant-design:${modelVisible ? 'down' : 'up'}-outlined`"
          color="#0000004f"
        ></icon>
      </div>
      <div v-if="modelApplyToggler === true">
        <a-checkbox
          v-model:checked="modelApply"
          @change="onApplyTogglerChange"
        ></a-checkbox>
      </div>
      <div
        class="cursor-pointer flex items-center text-[13px] text-[#4e5969]"
        @click="toggleShowContent"
      >
        <a-tooltip
          v-if="tooltip !== undefined"
          v-bind="
            Object.assign(
              {
                arrowPointAtCenter: true,
                placement: 'top',
              },
              tooltip
            ) || {}
          "
        >
          <div class="flex items-center border-b-dashed border-b-1 box-border">
            {{ label }}
          </div>
        </a-tooltip>

        <div v-else class="flex items-center box-border">
          {{ label }}
        </div>
      </div>
      <div
        class="text-[12px] text-[#0000004f] italic cursor-pointer"
        @click="toggleShowContent"
      >
        {{ field }}
      </div>
    </a-space>
    <div>
      <div v-if="modelMode !== 'default'">
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <div class="flex justify-center items-center text-[#1677ff]">
              <span class="text-[12px]">{{ modes[modelMode].title }}</span>
              <icon icon="ant-design:down-outlined"></icon>
            </div>
          </a>
          <template #overlay>
            <a-menu @click="menuClick" v-model:selected-keys="selectedKeys">
              <a-menu-item v-for="(item, key) in modes" :key="key">
                <a href="javascript:;">{{ item.title }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <div
        v-else
        class="b border-solid border-[#e5e6eb] p-[2px] flex justify-center items-center"
      >
        <icon icon="tabler:code" color="#0000004f"></icon>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import VzJsonViewer from "@viaz/components/json-viewer";
import { useStyle } from "@viaz/hooks";
import { ref } from "vue";


import ATooltip from "ant-design-vue/es/tooltip";

import type { MenuProps } from "ant-design-vue/es/menu";

const COMPONENT_NAME = "VzDesignerCustomizationPropHeader";
defineOptions({
  name: COMPONENT_NAME,
});

interface VzDesignerCustomizationPropHeaderProps {
  /** 文本 */
  label?: string;
  /** 字段 */
  field?: string;
  /** 说明提示文字 */
  tooltip?: Record<string, string>;

  /** model */
  // mode?: "api" | "custom" | "context";
}

const modes = {
  api: {
    key: "api",
    title: "外部接口",
  },
  custom: {
    key: "custom",
    title: "自定义选项",
  },
  context: {
    key: "context",
    title: "上下文变量",
  },
};

const {
  label = "label",
  field = "field",
  // toggler,
  tooltip,
} = defineProps<VzDesignerCustomizationPropHeaderProps>();

const emits = defineEmits<{
  applyChange: [apply: boolean];
}>();

const selectedKeys = ref([]);

const menuClick: MenuProps["onClick"] = ({ key }) => {
  console.info("menuClick => key", key);
  modelMode.value = key;
  selectedKeys.value = [key];
};

const { prefixCls } = useStyle("designer-customization-prop-header");

const modelApply = defineModel<boolean>("apply", {
  default: false,
});

const toggleShowContent = () => {
  modelVisibleToggler.value && (modelVisible.value = !modelVisible.value);
};

const modelVisibleToggler = defineModel<boolean | undefined>("visibleToggler", {
  default: false,
});

const modelApplyToggler = defineModel<boolean | undefined>("applyToggler", {
  default: false,
});

const modelVisible = defineModel<boolean | undefined>("visible", {
  default: true,
});

const modelMode = defineModel<"api" | "custom" | "context" | "default">(
  "mode",
  {
    default: "default",
  }
);

const onApplyTogglerChange = () => {
  if (modelVisibleToggler.value === true) {
    if (modelApply.value === true) {
      modelVisible.value = true;
    }
  }
  emits("applyChange", modelApply.value);
};
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-prop-header";

.@{prefix-cls} {
  // border: 1px solid red;
  --at-apply: "w-full flex justify-between items-center mb-1 py-1 px-0";
}
</style>
