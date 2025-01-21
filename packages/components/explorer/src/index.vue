<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-flex`">
      <VzDynamicPanel width="200px" placement="left" ref="dpElRef">
        <div class="h-full w-full inner-content-wrap">
          sidebar cn
          <div class="bd-red w-full">ssss</div>
        </div>
      </VzDynamicPanel>
      <div :class="`${prefixCls}-flex-contents`" ref="contentElRef">
        <div :class="`${prefixCls}-flex-contents-header`">
          <div>
            <a-space>
              <a-button type="primary">上传</a-button>
              <a-button :disabled="true">删除</a-button>
              <a-button :disabled="true">移动</a-button>
            </a-space>
          </div>
          <div>
            <a-space>
              <a-input-search
                v-model:value="value"
                placeholder="按 名称 搜索"
                enter-button
              />
              <a-radio-group v-model:value="viewMode">
                <a-radio-button value="list">列表</a-radio-button>
                <a-radio-button value="tile">平铺</a-radio-button>
              </a-radio-group>
            </a-space>
          </div>
        </div>
        <div :class="`${prefixCls}-flex-contents-main`">main</div>

        <div :class="`${prefixCls}-flex-contents-footer`">
          <div>
            <a-space>
              <a-checkbox v-model:checked="checkCurrentPage"
                >当页全选</a-checkbox
              >
              <a-button :disabled="true">删除</a-button>
              <a-button :disabled="true">移动</a-button>
            </a-space>
          </div>
          <div class="bd-red">
            <a-pagination
              v-model:current="current"
              responsive
              showQuickJumper
              showTotal
              :total="500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { VzExplorerProps } from "@viaz/types";

import { useStyle } from "@viaz/hooks";
import { ref } from "vue";
const { prefixCls } = useStyle("explorer");

const COMPONENT_NAME = "VzExplorer";
defineOptions({
  name: COMPONENT_NAME,
});

const viewMode = ref("list");
const checkCurrentPage = ref(false);
const current = ref(6);

const { gapless = true } = defineProps<VzExplorerProps>();
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-explorer";

.@{prefix-cls} {
  // border: 2px solid red;
  width: 100%;
  height: 100%;
  &-flex {
    --at-apply: flex h-full;

    // border: 1px solid green;

    &-contents {
      --at-apply: flex-1 flex flex-col;
      &-header {
        --at-apply: flex justify-between items-center h-40px bd-red;
      }
      &-main {
        --at-apply: flex-1;
      }
      &-footer {
        --at-apply: flex justify-between items-center bd-red;
      }
      // background-color: gray;
      // opacity: 0.3;
    }
  }
}
</style>
