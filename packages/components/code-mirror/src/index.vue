<template>
  <div :class="prefixCls">
    <div
      :class="`${prefixCls}-wrap`"
      ref="monacoEditorWrapElement"
      style="height: 100%"
    >
      {{ modelVale }}
      <code-mirror :lang="lang" :linter="linter" wrap basic>
        <pre>
          {{ modelVale }}
        </pre>
      </code-mirror>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStyle, useMessage } from "@viaz/hooks";

import { ref, toRefs } from "vue";

import CodeMirror from "vue-codemirror6";
import { json, jsonParseLinter } from "@codemirror/lang-json";

const { prefixCls } = useStyle("code-mirror");

import { CodeMirrorProps, COMPONENT_NAME } from "./code-mirror";

const { createMessage } = useMessage();

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<CodeMirrorProps>(), {
  language: "json",
});

const lang = json();
const linter = jsonParseLinter();

const emits = defineEmits<{
  save: [];
}>();

const { language } = toRefs(props);

const modelVale = defineModel<string>("value");
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-code-mirror";

.@{prefix-cls} {
  --at-apply: w-full h-full;
  border: 1px solid red;
}
</style>
