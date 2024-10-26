<template>
  <aside :class="prefixCls" ref="asideRef">
    <div :class="[`${prefixCls}-handler`]" ref="handlerElRef">
      <div
        :class="[
          `${prefixCls}-handler-resize h-full`,
          `${prefixCls}-handler-resize--${pressed ? 'pressed' : 'normal'}`,
        ]"
        ref="resizeHandlerElRef"
      ></div>
      <div
        :class="`${prefixCls}-handler-content`"
        @click="onToggleExpandCollapse"
      >
        <iconify-icon
          :icon="`prime:angle-${expanded ? 'left' : 'right'}`"
          class="text-xl"
        ></iconify-icon>
      </div>
    </div>
    <div
      :class="[
        `${prefixCls}-contents`,
        `${prefixCls}-contents--${expanded ? 'expanded' : 'collapsed'}`,
      ]"
      ref="contentsElRef"
    >
      <Transition name="slide-fade">
        <div class="h-full w-full" v-show="expanded">
          <div class="p-2 w-160px">
            <p>pressed:{{ pressed }}</p>
          </div>

          <slot></slot>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import type { VzDynamicPanelProps } from "@viaz/types";

import {
  useMouseInElement,
  useMouse,
  useMousePressed,
  MaybeElement,
} from "@vueuse/core";

import { useStyle } from "@viaz/hooks";
import { toRefs, ref, computed, watch } from "vue";

const { prefixCls } = useStyle("dynamic-panel");

const COMPONENT_NAME = "VzDynamicPanel";
defineOptions({
  name: COMPONENT_NAME,
});

const asideRef = ref<HTMLElement | null>(null);

const contentsElRef = ref<HTMLElement | null>(null);

const handlerElRef = ref<HTMLElement | null>(null);

const resizeHandlerElRef = ref<HTMLElement | null>(null);

const expanded = ref(true);

const props = withDefaults(defineProps<VzDynamicPanelProps>(), {});

const { pin, width } = toRefs(props);

console.info("props width =>", width);

console.info("contentsElRef =>", contentsElRef.value);

// @ts-ignore
const { elementWidth, elementHeight } = useMouseInElement(contentsElRef);

const onToggleExpandCollapse = () => {
  console.info("onToggleExpandCollapse");
  if (expanded.value === true) {
    defaultWidth.value = elementWidth.value;
  }
  expanded.value = !expanded.value;
};

// @ts-ignore
const { pressed } = useMousePressed({ target: resizeHandlerElRef });

const defaultWidth = ref(200);

const onUpedWidth = ref(200);

watch(pressed, () => {
  if (pressed.value === false) {
    let contentsElRefRect = contentsElRef.value.getBoundingClientRect();
    console.info("contentsElRefRect =>", contentsElRefRect.width);
    onUpedWidth.value = contentsElRefRect.width;
  }
});

const asideWidth = computed(() => {
  if (expanded.value === true) {
    if (pressed.value === true) {
      return elementX.value;
    } else {
      console.info("asideRef.value =>", asideRef.value);
      // return
    }
  } else {
  }

  // if (expanded.value === true && pressed.value === true) {
  //   return elementX.value;
  // }

  // if (expanded.value === true) {
  //   if (pressed.value === true) {
  //     return elementX.value;
  //   } else {
  //     if (defaultWidth.value === 200) {
  //       return defaultWidth.value;
  //     } else {
  //       return elementWidth.value;
  //     }
  //   }
  // } else {

  // }

  return width.value;
});

const onMousedown = (mouseEvent: MouseEvent) => {
  console.info("mouseEvent =>", mouseEvent);

  const el = handlerElRef.value!;

  console.info("el =>", el);

  // 记录按下的位置
  const mouseDownX = mouseEvent.clientX;
  const mouseDownY = mouseEvent.clientY;

  console.info("mouseDownX =>", mouseDownX, "mouseDownY =>", mouseDownY);

  // contentsElRef.value.style.width = "300px";

  console.info(
    "contentsElRef.value.style.width =>",
    contentsElRef.value.style.width
  );

  const elRect = el.getBoundingClientRect();

  const onMousemove = (e: MouseEvent) => {
    // 当前鼠标的位置减去鼠标在盒子里的位置就是要移动的距离
    let moveX = e.clientX - mouseDownX;
    let moveY = e.clientY - mouseDownY;

    let contentsElStyles = window.getComputedStyle(contentsElRef.value);

    let contentsElRefRect = contentsElRef.value.getBoundingClientRect();

    console.info(
      contentsElRefRect,
      parseFloat(contentsElRef.value.style.width)
    );

    let afWidth = contentsElRefRect.width + moveX;

    console.info("afWidth =>", afWidth);

    contentsElRef.value.style.width = afWidth + "px";

    // contentsElRef.value.

    // handlerElRef.value.left = moveX;
    // handlerElRef.value.top = moveY;
    // emit && emit("move", dragData.value);
  };

  const onMouseup = (_e: MouseEvent) => {
    // isMousedown.value = false;
    // 移除document事件
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("mouseup", onMouseup);
  };
  // 位document注册鼠标移动事件
  document.addEventListener("mousemove", onMousemove);
  // 鼠标抬起事件
  document.addEventListener("mouseup", onMouseup);

  console.info("elRect =>", elRect);
};
</script>

<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-dynamic-panel";

.@{prefix-cls} {
  --at-apply: h-full;
  position: relative;
  border: 0px solid #e3e3e3;
  // border-right-width: 1px;
  &-handler {
    // border: 1px solid #000;
    --at-apply: flex justify-center items-center w-16px h-full;
    position: absolute;
    opacity: 0;
    inset-inline-end: -16px;

    &:hover {
      opacity: 1;

      // border-left: 2px solid #000;
    }

    &-resize {
      border-left: 2px solid #e3e3e3;
      position: absolute;
      left: 0;
      z-index: 999;

      &:hover {
        cursor: col-resize;
      }

      &--pressed {
        cursor: e-resize !important;
        border-left: 2px solid #000;
        // background-color: red;
      }
    }

    &-content {
      --at-apply: flex justify-center items-center;
      inset-block-start: 50%;
      width: 16px;
      height: 40px;
      margin-block-start: -20px;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      position: absolute;
      // left: 2px;
      color: #999999;
      background: rgba(0, 0, 0, 0.03);
      border-color: #e3e3e3;
      border-style: solid;
      border-width: 1px;
      z-index: 100;
      border-left: none;
      // transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
  }

  &-contents {
    --at-apply: h-full;
    overflow: hidden;
    position: relative;

    user-select: none;

    &-resize-handler {
      position: absolute;
      user-select: none;
      width: 10px;
      height: 100%;
      // top: -16px;
      top: 0;
      // cursor: col-resize;
      right: -5px;

      // &:hover {
      //   &:before {
      //     background-color: #222222;
      //   }
      // }

      &::before {
        inset-inline-end: 50%;
        width: 2px;
        height: 100%;

        content: "";
        position: absolute;
        z-index: 50;
      }
    }

    &-resize-handler--pressed {
      &:before {
        cursor: col-resize;
        background-color: #222222;
      }
    }

    // background-color: red;
    &--collapsed {
      display: none;
      // border: 2px solid red;
    }
  }
}
</style>
