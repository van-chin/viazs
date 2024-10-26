<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-flex`">
      <VzDynamicPanel
        placement="left"
        width="300px"
        ref="dpElRef"
        resizeBorderColor="red"
      >
        <div class="w-full inner-content-wrap">
          sidebar cn
          <div class="">ssss</div>
        </div>
      </VzDynamicPanel>
      <div
        :class="`${prefixCls}-flex-contents`"
        ref="contentElRef"
        resizeBorderColor="red"
      >
        <div class="flex-1 flex flex-col">
          <div class="flex-1">dddd</div>

          <VzDynamicPanel
            placement="top"
            height="300px"
            ref="dpElRef"
            resizeBorderColor="red"
          >
            <div class="w-full inner-content-wrap">
              <div class="h-200px">ssss</div>
            </div>
          </VzDynamicPanel>
        </div>
        <VzDynamicPanel
          placement="right"
          width="300px"
          ref="dpElRef"
          resizeBorderColor="red"
        >
          <div class="w-full inner-content-wrap">
            <div class="h-200px">ssss</div>
          </div>
        </VzDynamicPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStyle } from "viaz";

import { ref } from "vue";

const { prefixCls } = useStyle("dynamic-panel-demo");

const dpElRef = ref(null);

const contentElRef = ref(null);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-dynamic-panel-demo";

.@{prefix-cls} {
  // h-400px
  --at-apply: w-full h-400px;

  &-flex {
    --at-apply: flex flex-row h-full;

    border: 1px solid green;

    &-contents {
      --at-apply: flex-1 flex flex-row;
      // background-color: gray;
      // opacity: 0.3;
    }
  }
}
</style>
