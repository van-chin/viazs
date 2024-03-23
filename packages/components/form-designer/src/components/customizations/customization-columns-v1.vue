<template>
  <div :class="prefixCls" ref="draggableElRef">
    <div>
      <!-- {{ modelValue }}
      <VzJsonViewer title="modelValue" :data="modelValue"></VzJsonViewer> -->

      <a-table
        :dataSource="modelValue"
        :columns="columns"
        bordered
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.key === 'title'">
            <a-input v-model:value="modelValue[index][column.key]"></a-input>
          </template>
          <template v-if="column.key === 'key'">
            <a-input v-model:value="modelValue[index][column.key]"></a-input>
          </template>
          <template v-if="column.key === 'dataIndex'">
            <VzDesignerCustomizationPropValue
              :value-types="valueTypes"
              v-model:value="modelValue[index][column.key]"
            ></VzDesignerCustomizationPropValue>
            <!-- <a-input v-model:value="modelValue[index][column.key]"></a-input> -->
          </template>
          <template v-if="column.key === 'component'">
            <a-space
              ><a-select
                v-model:value="modelValue[index][column.key]['name']"
                :options="componentLists"
                placeholder="请选择"
              ></a-select>
              <a-button type="link" @click="onConfigRule(index)">属性</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <a-drawer
    v-model:open="opening"
    class="custom-class"
    width="100%"
    root-class-name="root-class-name"
    :style="{ position: 'absolute' }"
    placement="right"
    :headerStyle="drawerHeaderStyle"
    :bodyStyle="{ padding: '12px' }"
    :get-container="false"
  >
    <template #closeIcon>
      <div class="flex justify-between items-center">
        <icon
          icon="ant-design:arrow-left-outlined"
          :inline="true"
          class="text-#000 cursor-pointer hover:color-#1677ff"
        />
        <span class="ml-2 text-#666 text-12px">配置组件属性</span>
      </div>
    </template>
    <div class="" v-if="modelValue.length">
      <div v-for="item in formItemRulePropsJson" class="mb-2">
        <VzDesignerCustomizationProp
          v-bind="item"
          v-model:value="modelValue[currentIndex][item.field]"
        ></VzDesignerCustomizationProp>
      </div>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import { nanoid } from "nanoid";
import { ref, reactive, watch } from "vue";
import { useDraggable } from "vue-draggable-plus";

import formItemRulePropsJson from "../../data/rule-props.json";

import VzDesignerCustomizationPropValue from "./customization-prop-value.vue";

const COMPONENT_NAME = "VzDesignerCustomizationColumns";
defineOptions({
  name: COMPONENT_NAME,
});
interface VzDesignerCustomizationColumnsProps {
  /**  类型 */
  options?: [];
  /** 数据模式 */
  mode: "api" | "custom" | "context";
}

const opening = ref(false);

const currentIndex = ref(0);

const onConfigRule = (index: number) => {
  currentIndex.value = index;
  opening.value = true;
};

const dataSource = ref([
  {
    id: "1",
    title: "姓名",
    dataIndex: "name",
    key: "name",
    component: "AInput",
  },
  {
    id: "1",
    title: "年龄",
    dataIndex: "age",
    key: "age",
    component: "AInput",
  },
]);

const componentLists = [
  {
    label: "输入框",
    value: "AInput",
  },
  {
    label: "选择框",
    value: "ASelect",
  },
];

const valueTypes = [
  {
    label: "STRING",
    value: "string",
    key: 1,
    title: "字符串",
  },
  {
    label: "NUMBER",
    value: "number",
    key: 2,
    title: "数值",
  },

  {
    label: "ARRAY",
    value: "array",
    key: 4,
    title: "数组",
  },
];

const columns = [
  {
    title: "TITLE",
    dataIndex: "title",
    key: "title",
    align: "center",
  },
  {
    title: "KEY",
    dataIndex: "key",
    key: "key",
    align: "center",
  },
  {
    title: "DATAINDEX",
    dataIndex: "dataIndex",
    key: "dataIndex",
    align: "center",
  },
  {
    title: "COMPONENT",
    dataIndex: "component",
    key: "component",
  },
  //
];

defineProps<VzDesignerCustomizationColumnsProps>();
const { prefixCls } = useStyle("designer-customization-columns");

const modelValue = defineModel<any>("value", {
  default: [],
});

(async function init() {
  console.info("modelValue =>", modelValue);
})();
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-designer-customization-columns";

.@{prefix-cls} {
  background-color: #eeeeee;
  --at-apply: w-full p-2 rd;
  &-item {
    background-color: #fff;
    --at-apply: "rd p-2 mb-2";
    display: grid;
    grid-template-columns: 20px 1fr 2fr 20px;
    grid-gap: 8px;

    &-fieldset {
      border: 1px solid #f0f0f0;
      --at-apply: px-1 py-1;
      &-legend {
        --at-apply: "px-1 py-0 text-#0000004f italic";
      }
    }

    &-gitem {
      background-color: rgba(21, 147, 201, 0.8);
    }
  }
}
</style>
