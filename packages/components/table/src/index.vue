<template>
  <DefineCurd class="tmp-reuse" v-slot="{ text, record, index, column }">
    <a-space>
      <!-- <component :is="" v-f></component> -->

      <component
        :is="action.component"
        v-bind="action.props"
        @click="onDetail(record)"
        :key="index"
        v-for="(action, index) in actions"
      />

      <!-- <Vz-button type="link" size="small" :gapless="true" text="查看" @click="onDetail(record)"   />

      <Vz-button type="link" size="small" :gapless="true" text="编辑" @click="onEdit(record)" />

      <Vz-popconfirm-button :canConfirm="false" :disabled="record.deletedAt" :gapless="true" type="link" text="删除"
        title="确定要删除此数据么?" @confirm="onDelete(record)" />
      <Vz-popconfirm-button :canConfirm="false" :disabled="!record.deletedAt" :gapless="true" type="link" text="恢复"
        title="确定要恢复此数据么?" @confirm="onRecover(record)" /> -->
    </a-space>
  </DefineCurd>
  <div :class="`${prefixCls}-wrapper`">
    <div :class="`${prefixCls}-content`" ref="contentElRef">
      <a-table
        :class="prefixCls"
        :id="tableId"
        v-bind="$attrs"
        ref="tableRef"
        :data-source="modelLists || []"
        bordered
        expandFixed="right"
        :columns="states.currentColumns"
        :pagination="false"
        :scroll="{ x: tableWrapperWidth, y: tableWrapperHeight - 56 }"
        @resizeColumn="onResizeColumn"
      >
        <!-- 透传 slot  /** 开始 */  -->
        <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
          <template v-if="name === 'headerCell'">
            <slot :name="name" v-bind="slotProps"></slot>

            <template v-if="slotProps.column.key === 'operations'">
              <div class="flex justify-between items-center">
                <span>{{ title }}</span>

                <a-space>
                  <a-dropdown placement="bottom" :trigger="['click']">
                    <!-- <icon
                    icon="ant-design:column-height-outlined"
                    :inline="true"
                  /> -->

                    <template #overlay>
                      <a-menu
                        @click="onTableSizeChange"
                        v-model:selectedKeys="state.tableSize"
                      >
                        <a-menu-item key="large"> 默认 </a-menu-item>
                        <a-menu-item key="middle"> 中等 </a-menu-item>
                        <a-menu-item key="small"> 紧凑 </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>

                  <icon
                    v-if="schemes?.length >= 1"
                    @click="openColumnsSet"
                    icon="ant-design:setting-outlined"
                    :inline="true"
                    class="cursor-pointer"
                  >
                  </icon>
                </a-space>
              </div>
            </template>
          </template>

          <template v-else-if="name === 'bodyCell'">
            <template
              v-if="slotProps.column.formatType === ColumnFormatTypeEnum.INDEX"
            >
              {{
                (paginations?.current - 1) * paginations?.pageSize +
                slotProps.index +
                1
              }}
            </template>
            <template
              v-if="
                slotProps.column.formatType === ColumnFormatTypeEnum.DATETIME
              "
            >
              {{
                slotProps.text
                  ? unref(
                      useDateFormat(slotProps.text, slotProps.column.formater)
                    )
                  : "-"
              }}
            </template>

            <template
              v-if="slotProps.column.formatType === ColumnFormatTypeEnum.JOIN"
            >
              {{
                slotProps.text
                  ? slotProps.text.join(slotProps.column.formater)
                  : "-"
              }}
            </template>

            <template
              v-if="
                slotProps.column.formatType === ColumnFormatTypeEnum.TOFIXED
              "
            >
              {{
                slotProps.text
                  ? parseFloat(slotProps.text).toFixed(
                      slotProps.column.formater
                    )
                  : slotProps.text
              }}
            </template>

            <template v-if="slotProps.column.key === 'operations'">
              <slot :name="name" v-bind="slotProps"></slot>
              <!-- <ReuseCurd
              :record="slotProps.record"
              :column="slotProps.column"
              :text="slotProps.text"
              :index="slotProps.index"
            /> -->
            </template>

            <template v-else>
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </template>

          <template v-else>
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </template>

        <!-- 透传 slot  /** 结束 */  -->
        <!-- // large middle small @select="onTableSizeChange" -->
        <!-- 内置默认的（会被透出solt重写覆盖） slot   /** 开始 */  -->
        <template
          #headerCell="{ title, column }"
          v-if="!slotsNames.includes('headerCell')"
        >
          <template v-if="column.key === 'operations'">
            <div class="flex justify-between items-center">
              <span>{{ title }}</span>
              <a-space>
                <a-dropdown placement="bottom" :trigger="['click']">
                  <icon
                    icon="ant-design:column-height-outlined"
                    :inline="true"
                  />

                  <template #overlay>
                    <a-menu
                      @click="onTableSizeChange"
                      v-model:selectedKeys="state.tableSize"
                    >
                      <a-menu-item key="large"> 默认 </a-menu-item>
                      <a-menu-item key="middle"> 中等 </a-menu-item>
                      <a-menu-item key="small"> 紧凑 </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>

                <icon
                  v-if="schemes?.length >= 1"
                  @click="openColumnsSet"
                  icon="ant-design:setting-outlined"
                  :inline="true"
                  class="cursor-pointer"
                >
                </icon>
              </a-space>
            </div>
          </template>
        </template>

        <template
          v-if="!slotsNames.includes('bodyCell')"
          #bodyCell="{ text, record, index, column }"
        >
          <!-- date/datetime 格式化  -->
          <template v-if="column.formatType === 2">
            {{ text ? unref(useDateFormat(text, column.formater)) : "-" }}
          </template>
          <template v-if="column.key === 'operations'">
            <!-- <div>内置</div> -->

            <ReuseCurd
              :record="record"
              :column="column"
              :text="text"
              :index="index"
            />
          </template>
        </template>

        <!-- 内置 slot  /** 结束 */  -->
      </a-table>
      <a-drawer
        v-if="schemes?.length >= 1"
        title="数列方案配置"
        placement="right"
        width="90%"
        size="large"
        :bodyStyle="bodyStyle"
        :headerStyle="{ padding: '16px !important' }"
        v-model:open="columnsSetting"
        :get-container="false"
        :style="{ position: 'absolute' }"
      >
        <VzSchemeSetting
          v-if="schemes?.length >= 1"
          :data-table="dataTable"
        ></VzSchemeSetting>
      </a-drawer>
    </div>

    <div
      :class="`${prefixCls}-footer-bar flex justify-between items-center bg-white p-2`"
      v-if="footerBar"
    >
      <div>
        <slot name="footer-action"></slot>
      </div>

      <a-pagination
        v-bind="paginations"
        @change="onPaginationChange"
        :show-total="(total: number) => `总共 ${total} 条`"
        show-size-changer
        :responsive="true"
        show-quick-jumper
      ></a-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Table as ATable, Pagination as APagination } from "ant-design-vue/es";
import type { PaginationProps } from "ant-design-vue/es/pagination";
import { Icon } from "@iconify/vue";
import { useStyle } from "@viaz/hooks";

import { ColumnFormatTypeEnum } from "@viaz/enums";

import { Sortable, Plugins } from "@shopify/draggable";
import type { SortableStopEvent } from "@shopify/draggable";

import {
  ref,
  useAttrs,
  unref,
  onMounted,
  reactive,
  computed,
  useSlots,
  toRefs,
  getCurrentInstance,
} from "vue";

import type { ComponentInternalInstance } from "vue";

import {
  VzTableProps,
  DragEndParams,
  VzTableColumn,
  SortableEndParams,
} from "@viaz/types";

import VzSchemeSetting from "./scheme-setting.vue";

import {
  createReusableTemplate,
  useResizeObserver,
  useDateFormat,
  useElementSize,
} from "@vueuse/core";

const COMPONENT_NAME = "VzTable";
defineOptions({
  name: COMPONENT_NAME,
});

const modelLists = defineModel<object[]>("lists", {
  default: [],
});

const attrs = useAttrs();

const { prefixCls } = useStyle("table");

const props = withDefaults(defineProps<VzTableProps>(), {
  sortable: false,
  animation: 600,
  uri: false,
  schemes: [],
  footerBar: true,
  paginations: {},
  columns: [],
  actions: [
    {
      position: "ro",
      component: "VzButton",
      props: {
        type: "link",
        text: "查看",
        gapless: true,
        size: "small",
      },
      emit: "curd-detail",
    },
    {
      position: "ro",
      component: "VzButton",
      props: {
        type: "link",
        text: "编辑",
        gapless: true,
      },
      emit: "curd-edit",
    },
    {
      position: "ro",
      component: "VzPopconfirmButton",

      props: {
        canConfirm: false,
        type: "link",
        text: "删除",
        title: "确定要删除此数据么?",
        gapless: true,
      },
      emit: "curd-destroy",
    },
    {
      position: "ro",
      component: "VzPopconfirmButton",
      props: {
        canConfirm: false,
        type: "link",
        text: "恢复",
        title: "确定要恢复此数据么?",
        gapless: true,
      },
      emit: "curd-recovery",
    },
  ],
});

const {
  sortable,
  animation,
  tableId,
  uri,
  schemes,
  footerBar,
  paginations,
  columns,
  actions,
} = toRefs(props);

const emit = defineEmits<{
  paginationChange: [value: any];
  curdDelete: [value: any];
  curdLists: [value: any];
  curdDetail: [value: any];
  curdDdit: [value: any];
  curdRecover: [value: any];
  dragEnd: [value: DragEndParams];
  sortableEnd: [value: SortableEndParams];
}>();

const currentInstance = getCurrentInstance() as ComponentInternalInstance;

// 重用模板
const { define: DefineCurd, reuse: ReuseCurd } = createReusableTemplate();
// curd 相关方法
const onDetail = (record: any) => {
  console.info("openDetail.record =>", record);
  // emit('curd-detail',record);
};

const onEdit = (record: any) => {
  console.info("onEdit.record =>", record);
  // emit('curd-edit', record);
};

const onDelete = (record: any) => {
  console.info("onDelete.record =>", record);
  // emit('curd-edit', record);
};

const onRecover = (record: any) => {
  console.info("onRecover.record =>", record);
  // emit('curd-edit', record);
};

const tableRef = ref();

defineExpose({
  tableRef,
});

const contentElRef = ref(null);

console.info("contentElRef =>", contentElRef.value);

const { width: tableWrapperWidth, height: tableWrapperHeight } =
  useElementSize(contentElRef);

const tableScroll = ref({
  x: "max-content",
  // x: true,
  // y: 400,
  // y: wrapperHeight.value - 56,
});

onMounted(() => {
  console.info("vvv =>", "xxx");
});

// 表格高度
useResizeObserver(contentElRef, (entries) => {
  // console.info('entries =>',entries);
  const entry = entries[0];

  // console.info('entry =>',entry);

  const { height } = entry.contentRect;
  // tableScroll.value.x = width;
  // if (height - 60 > 180) {
  //   tableScroll.value.y = height - 110;
  // } else {
  //   tableScroll.value.y = 180 - 60;
  // }

  // tableScroll.value.y = height - 120;

  tableScroll.value.y = height - 60;

  // console.info('tableScroll.value.y =>',tableScroll.value.y);

  // console.info("tableScroll =>", tableScroll.value);
});

const internalProcess = uri.value !== false;
// console.info("Vz-table:internalProcess =>", internalProcess);
// large middle small
let tableSize = ref(["large"]);

const state = reactive({
  tableSize: ["large"],
});

const schemeActiveKey = ref(0);

const customRow = ref();

const activeSchemeColumns = ref<any[]>([]);

const scTableRowSelection: TableProps["rowSelection"] = {
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  // getCheckboxProps: (record: any) => ({
  //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //   name: record.name
  // })
};

if (schemes.value.length >= 1) {
  // customRow.value = useDraggable<any>(schemes[0].columns);
}

const onSchemeChange = (activeKey: string | number) => {
  // console.info('schemeChange =>', activeKey);
  // console.info('schemeActiveKey =>', schemeActiveKey.value);
  // customRow.value = useDraggable<any>(schemes[activeKey].columns);
};

const onSchemeTabClick = () => {
  console.info("onSchemeTabClick =>");
};

const states = computed((): { currentColumns: VzTableColumn[] } => {
  return {
    currentColumns: [],
    // columns: [],
    // filtering:false,
  };
});

const onTableSizeChange = ({ item, key }) => {
  // console.info('vvvv');
  console.info("item =>", item);
  console.info("key =>", key);

  state.tableSize = [key];
};

const slots = useSlots();
const slotsNames = Object.keys(slots);

const parseColumns = () => {
  columns.value.forEach((item) => {
    if (item.dataIndex.includes(".")) {
      item.dataIndex = item.dataIndex.split(".");
    }
  });
};

(async function init() {
  parseColumns();
  states.value.currentColumns = columns.value;
})();

// 判单 columns 是否包含 operations 列
if (columns.value) {
  const operationsKeyIndex = columns.value.findIndex(
    (column) => column.key === "operations"
  );
}

const schemeColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    customRender: function ({ index }) {
      return index + 1;
    },
    fixed: "left",
    width: 65,
  },

  {
    title: "列头",
    dataIndex: "title",
    key: "title",
    align: "center",
    fixed: "left",
    resizable: true,
    width: 120,
    rowDrag: true,
  },
  {
    title: "宽度",
    dataIndex: "width",
    key: "width",
    width: 80,
    align: "center",
  },
  {
    title: "最小宽度",
    dataIndex: "min_width",
    key: "min_width",
    width: 90,
    align: "center",
  },
  {
    title: "最大宽度",
    dataIndex: "max_width",
    key: "max_width",
    width: 90,
    align: "center",
  },
  {
    title: "列宽拖动",
    dataIndex: "resizable",
    key: "resizable",
    width: 90,
    align: "center",
  },
  {
    title: "对齐方式",
    dataIndex: "align",
    key: "align",
    width: 90,
    align: "center",
  },
  {
    title: "固定方式",
    dataIndex: "fixed",
    key: "fixed",
    width: 90,
    align: "center",
    fixed: "right",
  },
];

// 如果包含吧 operations 但没有 传入 `headerCell`时，增加 headerCell 到slots中

// if (operationsKeyIndex >= 0) {
//   console.info("current slots =>", slots.bodyCell);
// }

// CURD openDetail
const lastPageSize = ref(paginations.value.pageSize);
const onPaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  if (lastPageSize.value !== pageSize) {
    page = 1;
  }

  lastPageSize.value = pageSize;

  emit("paginationChange", { page, pageSize });
};

const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
  current,
  size
) => {
  emit("paginationChange", { page: 1, pageSize: size });
};

let columnsSetting = ref(false);

const openColumnsSet = () => {
  // console.info('ss');
  columnsSetting.value = true;
};

const columnsSetTableRowSelection = {
  fixed: true,
};

const bodyStyle = {
  height: "100%",
  overflow: "hidden",
  padding: "16px",
};
const onResizeColumn = (width: number, column: any) => {
  console.info("width =>", width);
  column.width = width;
};

// Sortable
// 行拖动排序
setTimeout(() => {
  if (sortable.value) {
    const containerSelector = `#${tableId.value} .ant-table-tbody`;
    const containers = document.querySelector(containerSelector);
    const sortabler = new Sortable(containers as HTMLElement, {
      draggable: ".ant-table-row",
      mirror: {
        appendTo: containerSelector,
        constrainDimensions: true,
      },
      plugins: [Plugins.SortAnimation],
      sortAnimation: {
        duration: 200,
        easingFunction: "ease-in-out",
      },
    });
    sortabler.on("sortable:stop", (sortableStopEvent: SortableStopEvent) => {
      modelLists.value[sortableStopEvent.oldIndex] = modelLists.value.splice(
        sortableStopEvent.newIndex,
        1,
        modelLists.value[sortableStopEvent.oldIndex]
      )[0];
      emit("sortableEnd", {
        oldIndex: sortableStopEvent.oldIndex,
        newIndex: sortableStopEvent.newIndex,
        dragEvent: sortableStopEvent.dragEvent,
        sortabledDataSource: modelLists.value,
      });
    });
  }
}, 100);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-table";

.@{prefix-cls}-wrapper {
  // border: 1px solid red;
  --at-apply: h-full w-full flex flex-col bg-transparent;

  overflow: hidden;
}

.@{prefix-cls}-content {
  --at-apply: h-full flex-1 w-full min-h-10px;

  overflow: hidden;
}

.@{prefix-cls}-footer-bar {
  // border: 1px solid green;
  --at-apply: w-full;
}

.@{prefix-cls} {
  --at-apply: h-full flex-1;

  :deep(.draggable-container--is-dragging) {
    .draggable-source--is-dragging {
      td {
        border-bottom: 2px solid #1677ff !important;

        // box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
      }
    }

    .draggable--over {
      td {
        // border: 2px solid red !important;
      }
    }

    .draggable-mirror {
      z-index: 10;
      // background-color: red;
      // border-color: red;
      transform: scale(1.025);
      // width: 800px;
      // background: red;
      // border: 2px solid #1677ff;
      // box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;

      box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
        rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
    }
  }
}
</style>
