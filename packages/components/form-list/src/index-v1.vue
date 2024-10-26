<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-action-bar`" v-if="hab">
      <div :class="`${prefixCls}-action-bar-left`"></div>
      <div :class="`${prefixCls}-action-bar-right`">
        <a-input placeholder="请按 名称/姓名 搜索物料" class="w-full"></a-input>
      </div>
    </div>
    <div>{{ activeElement.value }}</div>
    <a-table
      v-bind="$attrs"
      :columns="parseedColumns"
      :data-source="modelValue"
      @change="onChange"
      :rowKey="rowKey"
      ref="tableRef"
    >
      <template #headerCell="{ title, column }">
        <template v-if="column.key === 'index'">
          <div>
            <a-button
              v-if="hab === false"
              size="small"
              type="primary"
              shape="circle"
              @click="onAddRow"
            >
              <icon icon="ant-design:plus-outlined" :inline="true" />
            </a-button>
            <span v-else>{{ title }}</span>
          </div>
        </template>

        <template v-else>
          <div
            :class="`${prefixCls}-header-item`"
            :data-key="column.key"
            :data-data-index="column.key"
            :data-component-item="1"
            @click.stop="onCheck(column)"
          >
            {{ title }}
          </div>
        </template>
      </template>

      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.key === 'index'">
          <div :class="`${prefixCls}-index-wrapper`">
            <div :class="`${prefixCls}-index-wrapper-index index`">
              {{ calcIndex(index) }}
            </div>
            <div :class="`${prefixCls}-index-wrapper-delete delete`">
              <a-button
                size="small"
                danger
                shape="circle"
                @click="onDeleteRow(index)"
              >
                <icon icon="ant-design:delete-outlined" :inline="true" />
              </a-button>
            </div>
          </div>
        </template>

        <template v-else>
          <template v-if="column.component">
            <component
              :is="column.component.name"
              v-bind="column.component.props"
              v-on="parseEvents(column, index)"
              :index="index"
              :class="
                column.component.name === 'ACheckbox' ||
                column.component.name === 'ASwitch'
                  ? ''
                  : 'w-full'
              "
              v-model:[column.component.vModelField]="record[column.dataIndex]"
            >
            </component>
          </template>

          <template v-else>
            {{ text }}
          </template>
        </template>
      </template>
    </a-table>
  </div>

  <div
    :style="boxStyles"
    fixed
    pointer-events-none
    z-9999
    border="1 $vp-c-brand"
  />
  <div
    :style="pointStyles"
    fixed
    top-0
    left-0
    pointer-events-none
    w-2
    h-2
    rounded-full
    bg-green-400
    shadow
    z-999
  />
</template>
<script lang="ts" setup>
import { useRequest } from "vue-hooks-plus";
import { useStyle } from "@viaz/hooks";
import { createNetWork } from "@viaz/utils";
import { isFunction, isObject } from "@vue/shared";
import type { VzFormTableProps, VzFormTableColumn } from "@viaz/types";
import { Icon } from "@iconify/vue";
import { cloneDeep } from "lodash-es";
import { nanoid } from "nanoid";

import {
  useActiveElement,
  useElementBounding,
  useElementByPoint,
  useEventListener,
  useMouse,
} from "@vueuse/core";

import { useDraggable } from "vue-draggable-plus";
import type { ComponentInternalInstance } from "vue";
import { getCurrentInstance, ref, reactive, watch, computed } from "vue";
import type { PaginationProps } from "ant-design-vue/es/pagination";

const { prefixCls } = useStyle("form-table");

const COMPONENT_NAME = "VzFormTable";
defineOptions({
  name: COMPONENT_NAME,
});

const activeElement = useActiveElement();

watch(
  () => activeElement.value,
  (el) => {
    console.log("focus changed to", el);
  }
);

const { x, y } = useMouse({ type: "client" });
const { element } = useElementByPoint({ x, y });
const bounding = reactive(useElementBounding(element));

useEventListener("scroll", bounding.update, true);

const boxStyles = computed(() => {
  if (element.value) {
    const { dataset } = element.value;
    console.info("dataset", dataset, dataset.hasOwnProperty("componentItem"));
    if (
      dataset.hasOwnProperty("componentItem") &&
      dataset.componentItem === "1"
    ) {
      return {
        display: "block",
        width: `${bounding.width}px`,
        height: `${bounding.height}px`,
        left: `${bounding.left}px`,
        top: `${bounding.top}px`,
        backgroundColor: "#3eaf7c44",
        transition: "all 0.05s linear",
      } as Record<string, string | number>;
    }
    // hasOwnProperty
  }
  return {
    display: "none",
  };
});

const pointStyles = computed<Record<string, string | number>>(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}));

const tableRef = ref();

const {
  api,
  options,
  params,
  initial,
  columns = [],
  rowKey = "id",
  hab = false,
} = defineProps<VzFormTableProps>();

const modelValue = defineModel<object[]>("value", {
  default: [],
});

const currentInstance: ComponentInternalInstance = getCurrentInstance();

const emits = defineEmits<{
  added: [totality: number];
  deleted: [totality: number];
}>();
// 动态生成 emit 事件
const emitEventHandler = (field: string, event: string, params: any) => {
  const eo = `${field}-${event}`;

  currentInstance.emitsOptions[eo] = null;
  // console.info('eo =>',eo);
  // console.info('params =>',params);
  emits(eo, params);
};
const parseEvents = (column: VzFormTableColumn, index: number) => {
  if (column.component?.hasOwnProperty("events")) {
    // console.info('需要解析事件 =>',column.component,column.component.events);
    let emitsEvents: any = {};
    for (const key in column.component?.events) {
      emitsEvents[key] = (...args: any) => {
        let params: any = reactive({
          index: 0,
        });
        if (
          column.component !== undefined &&
          column.component.events !== undefined
        ) {
          column.component.events[key].map((pkey: string, index: number) => {
            params[pkey] = args[index];
          });
        }

        params.index = calcIndex(index) - 1;
        emitEventHandler(column.key as string, key, params);
      };
    }
    return emitsEvents;
  } else {
    return {};
  }
};

const parseedColumns = ref<VzFormTableColumn[]>([]);

const parseColumn = () => {
  let hasIndexColumn = false;
  parseedColumns.value = columns.map((column) => {
    if (column.key === "index") {
      hasIndexColumn = true;
    }
    return column;
  });

  if (hasIndexColumn === false) {
    const indexArray = {
      title: "序号",
      dataIndex: "index",
      key: "index",
      fixed: "left",
      align: "center",
      width: 80,
    };
    parseedColumns.value.unshift(indexArray as VzFormTableColumn);
  }
};

parseColumn();

const onCheck = (column) => {
  console.info("onCheck", column);
};

const currentPagination = ref({
  pageSize: 10,
  current: 1,
});

useDraggable(".vz-form-table .ant-table-tbody", modelValue, {
  draggable: ".ant-table-row",
  onUpdate() {
    console.log("update");
  },
  onChange(event) {
    console.info("on changed", modelValue.value);
  },
});

const onChange = (pagination: PaginationProps) => {
  currentPagination.value.current = pagination.current || 1;
  currentPagination.value.pageSize = pagination.pageSize || 10;
};

const calcIndex = (index: number) => {
  return (
    (currentPagination.value.current - 1) * currentPagination.value.pageSize +
    index +
    1
  );
};

const onAddRow = () => {
  let clonedInitial = cloneDeep(initial);
  clonedInitial[rowKey] = nanoid();
  modelValue.value.push(clonedInitial);

  emits("added", modelValue.value.length);
};

const onDeleteRow = (index: number) => {
  // console.info("onDeleteRow =>");
  modelValue.value.splice(index, 1);

  emits("deleted", modelValue.value.length);
};

const { data, loading, run } = useRequest(
  () => {
    console.info("api =>", api);
    if (isFunction(api)) {
      return api(params);
    }
    if (isObject(api)) {
      const network = createNetWork() as any;
      return network.get({ url: api.uri, params });
    }
  },
  {
    manual: true,
  }
);

const getOptions = () => {
  if (options) {
    // optionsData.value = options;
    data.value = options;
    return;
  } else {
    run();
    return;
  }
};

(async () => {
  getOptions();
})();

watch(
  () => params,
  () => {
    getOptions();
    // run();
  },
  {
    deep: true,
  }
);

watch(
  () => options,
  () => {
    getOptions();
  },
  {
    deep: true,
  }
);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-form-table";

.@{prefix-cls} {
  --at-apply: min-w-[100px] w-full;

  &-header-item {
    // border: 1px solid red;
    // outline: 2px solid #1890ff;
  }

  &-header-item.active {
    // border: 1px solid red;
    outline: 2px solid #1890ff;
  }

  &-action-bar {
    --at-apply: flex justify-between items-center p-2 mb-2;
  }
  // border: 1px solid red;
  &-index-wrapper {
    // border: 1px solid red;

    height: 24px;
    min-height: 24px;
    --at-apply: flex justify-center items-center;
    &-index {
      // display: none;
    }

    &-delete {
      display: none;
    }

    &:hover {
      // background-color: red;
      .index {
        display: none;
      }
      .delete {
        display: block;
      }
    }
  }
}
</style>

<style>
.ims-form-table {
  .ant-table-cell {
    .ant-select-selection-placeholder {
      text-align: left;
    }
    .ant-select-selection-item {
      text-align: left;
    }
  }
}

.ims-form-table-select-popup {
  .ant-select-item-option {
    text-align: left;
  }
}
</style>
