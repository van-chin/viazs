<template>
  <div :class="prefixCls">
    <a-checkbox-group
      class="w-full"
      v-model:value="checkedEvents"
      @change="onChange"
    >
      <div :class="`${prefixCls}-item`" :key="item.name" v-for="item in events">
        <div class="w-[145px]">
          <a-checkbox :value="item.name" class="flex justify-left items-center">
            <span class="break-all text-[10px]">{{ item.name }}</span>
          </a-checkbox>
        </div>
        <div class="flex-1 w-[100px] text-[10px]">
          <div class="text-[#0000004f] mb-1 overflow-hidden text-ellipsis">
            {{ item.description }}
          </div>
          <div class="text-[#c41d7f] overflow-hidden text-ellipsis italic">
            {{ item.callback }}
          </div>
        </div>
      </div>
    </a-checkbox-group>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import { ref, watch } from "vue";
import type { CheckboxGroupProps } from "ant-design-vue/es/checkbox";
const COMPONENT_NAME = "VzDesignerCustomizationEvents";
defineOptions({
  name: COMPONENT_NAME,
});

/** 组件事件 */
interface ComponentEvent {
  /** 事件名称 */
  name: string;
  /** 事件描述 */
  description: string;
  /** 回调函数 */
  callback: string;
  /** 回调参数 */
  arguments: string[];
}

interface VzDesignerCustomizationEventsProps {
  /** 事件 */
  events?: ComponentEvent[];
}

const { events = [] } = defineProps<VzDesignerCustomizationEventsProps>();

const { prefixCls } = useStyle("designer-customization-events");

const modelValue = defineModel<Record<string, string[]>>("value", {
  default: {},
});

const checkedEvents = ref<string[]>([]);

const onChange: CheckboxGroupProps["onChange"] = (checkedValue) => {
  let valueEvents: Record<string, string[]> = {};
  checkedValue.forEach((item) => {
    let findedIndex = events.findIndex((event) => event.name === item);
    let findedEvent = events[findedIndex];
    valueEvents[item as string] = findedEvent.arguments;
  });
  modelValue.value = valueEvents;
};

watch(
  modelValue,
  (newModelValue) => {
    checkedEvents.value = Object.keys(newModelValue);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-events";

.@{prefix-cls} {
  --at-apply: p-2 pb-0 w-full rd;
  background-color: #eeeeee;
  &-item {
    --at-apply: "rd bg-[#fff] mb-2 p-2 flex justify-between items-center w-full";
  }
}
</style>
