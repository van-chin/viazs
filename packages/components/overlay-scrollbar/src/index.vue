<template>
  <div :class="prefixCls">
    <overlay-scrollbars-component
      ref="scrollbarRef"
      class="overlayscrollbars-vue h-full"
      :options="{
        scrollbars: {
          autoHide: 'leave',
          autoHideDelay: 1,
        },
      }"
      @os-scroll="onScroll"
    >
      <slot></slot>
    </overlay-scrollbars-component>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

import { ref } from "vue";

// import type { VzOverlayScrollbarProps } from "@viaz/types";

import "overlayscrollbars/overlayscrollbars.css";

const COMPONENT_NAME = "VzOverlayScrollbar";
defineOptions({
  name: COMPONENT_NAME,
});

// const props = withDefaults(defineProps<VzOverlayScrollbarProps>(), {
//   options: {
//     scrollbars: {
//       autoHide: "leave",
//       autoHideDelay: 1,
//     },
//   },
// });

// const { options } = toRefs(props);

const emit = defineEmits(["scroll"]);
const { prefixCls } = useStyle("overlay-scrollbar");
const scrollbarRef = ref();

function onScroll(instance, event) {
  emit("scroll", instance, event);
}

function scrollTo(payload) {
  scrollbarRef.value?.osInstance()?.elements()?.viewport?.scrollTo(payload);
}

defineExpose({
  scrollTo,
  instance: scrollbarRef.value,
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-overlay-scrollbar";

.@{prefix-cls} {
  --at-apply: w-full h-full;
}
</style>
