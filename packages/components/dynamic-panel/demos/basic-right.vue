<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-flex`">
      <div :class="`${prefixCls}-flex-contents`" ref="contentElRef">
        right-contents
      </div>

      <VzDynamicPanel :width="200" placement="right" ref="dpElRef">
        <div class="h-full w-full inner-content-wrap">
          sidebar cn
          <div class="bd-red">ssss</div>
        </div>
      </VzDynamicPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage, useStyle } from "viaz";
import { useMouseInElement, useElementSize } from "@vueuse/core";
// import VzDynamicPanel from "..";

import { ref } from "vue";
import { dropRight } from "lodash-es";

const { prefixCls } = useStyle("dynamic-panel-demo");

const dpElRef = ref(null);

const contentElRef = ref(null);

const { width, height } = useElementSize(contentElRef);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-dynamic-panel-demo";

.@{prefix-cls} {
  // h-400px
  --at-apply: w-full h-400px;

  &-flex {
    --at-apply: flex h-full;

    border: 1px solid green;

    &-contents {
      --at-apply: flex-1 flex;
      // background-color: gray;
      // opacity: 0.3;
    }
  }
}
</style>
