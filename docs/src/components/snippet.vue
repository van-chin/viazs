<template>
  <div :class="prefixCls">
    <a-typography-title :level="3" class="my-4" :id="normalizeTitle"
      >{{ title }}
    </a-typography-title>

    <!-- <section :id="normalizeTitle"></section> -->

    <div :class="`${prefixCls}-wrap`">
      <div class="demo-block">
        <slot name="demo"></slot>
      </div>

      <a-divider orientation="left">
        {{ title }}
      </a-divider>
      <slot name="desc"></slot>

      <div class="divider mb-2"></div>

      <a-space class="flex items-center justify-center">
        <iconify-icon
          icon="ant-design:codepen-outlined"
          :inline="true"
          class="text-6 hover:cursor-pointer"
        ></iconify-icon>

        <iconify-icon
          icon="ant-design:code-sandbox-outlined"
          :inline="true"
          class="text-6 hover:cursor-pointer"
        ></iconify-icon>

        <iconify-icon
          :icon="`${showCode ? 'heroicons-solid:code' : 'charm:code'}`"
          :inline="true"
          class="text-6 hover:cursor-pointer"
          @click="showCode = !showCode"
        ></iconify-icon>
      </a-space>

      <div v-show="showCode">
        <div :class="`${prefixCls}-wrap-code`">
          <a-space
            :class="`${prefixCls}-wrap-code-tools`"
            class="flex items-center justify-end p-2"
          >
            <iconify-icon
              icon="ant-design:edit-filled"
              class="text-5 hover:cursor-pointer"
              @click="onCopy"
            ></iconify-icon>
            <iconify-icon
              icon="ant-design:copy-outlined"
              :inline="true"
              class="text-5 hover:cursor-pointer"
              @click="onCopy"
            ></iconify-icon>
          </a-space>
          <div v-show="showCode" v-html="html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface VzSnippetProps {
  title: string;
  code: string;
}

import { ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { getHighlighter } from "shikiji";

import { useStyle, useMessage } from "viaz";

const { prefixCls } = useStyle("snippet");

const COMPONENT_NAME = "VzSnippet";
defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzSnippetProps>(), {
  title: "标题",
  code: "",
});

const { title, code } = props;

const { copy } = useClipboard();

const normalizeTitle = title.replace(/\s+/g, "-");
const originCode = decodeURIComponent(code);
const showCode = ref(false);
const html = ref("");

const shiki = getHighlighter({
  themes: ["vitesse-light", "vitesse-dark"],
  langs: ["vue"],
});

shiki.then((highlighter) => {
  html.value = highlighter.codeToHtml(originCode, {
    lang: "vue",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  });
});

function onCopy() {
  copy(originCode);
  const { createMessage } = useMessage();

  createMessage.success({
    content: "复制成功",
    duration: 5,
  });
}
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-snippet";

.@{prefix-cls} {
  --at-apply: w-full h-full;

  &-wrap {
    border: 1px solid rgba(5, 5, 5, 0.06);
    --at-apply: p-2 mb-2 rd;
    .divider {
      border-bottom: 1px dashed rgba(5, 5, 5, 0.06);
    }
    &-code {
      border: 1px solid rgb(22, 119, 255);
      position: relative;
      &-tools {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>
