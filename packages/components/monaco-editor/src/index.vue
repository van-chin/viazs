<template>
  <div :class="prefixCls">
    <div
      :class="`${prefixCls}-wrap`"
      id="monaco-editor-wrap"
      ref="monacoEditorWrapElement"
      style="height: 100%"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { useStyle, useMessage } from "@viaz/hooks";

const { prefixCls } = useStyle("monaco-editor");

import { MonacoEditorProps, COMPONENT_NAME } from "./monaco-editor";

import {
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";

import * as monaco from "monaco-editor";

//@ts-ignore
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
//@ts-ignore
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
//@ts-ignore
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
//@ts-ignore
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
//@ts-ignore
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const { createMessage } = useMessage();

interface EditorConfig {
  theme: string;
  language: string;
  eol: number;
  wordWrap: WordWrapOptions;
}

type WordWrapOptions = "off" | "on" | "wordWrapColumn" | "bounded";

const config = reactive<EditorConfig>({
  theme: "vs-light",
  language: "json",
  eol: monaco.editor.EndOfLineSequence.LF,
  wordWrap: "on",
});

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    switch (label) {
      case "json":
        return new jsonWorker();
      case "css":
      case "scss":
      case "less":
        return new cssWorker();
      case "html":
      case "handlebars":
      case "razor":
        return new htmlWorker();
      case "typescript":
      case "javascript":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<MonacoEditorProps>(), {
  // language: "json",
});

const emits = defineEmits<{
  save: [];
}>();

const { language } = toRefs(props);

const modelVale = defineModel<string>("value");

const monacoEditorWrapElement = ref<HTMLElement>();

const initEditor = () => {
  nextTick(() => {
    //
    const monacoEditorWrap = document.getElementById("monaco-editor-wrap");
    console.info("monacoEditorWrap =>", monacoEditorWrap);
    editor = monaco.editor.create(monacoEditorWrap as HTMLElement, {
      theme: config.theme,
      value: modelVale.value,
      acceptSuggestionOnEnter: "on",
      acceptSuggestionOnCommitCharacter: true,
      readOnly: false,
      automaticLayout: true,
      language: language.value,
      folding: true,
      roundedSelection: false,
      overviewRulerBorder: false,
      wordWrap: "on",
      formatOnPaste: true,
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      let currentValue = editor?.getValue();

      modelVale.value = currentValue;
      createMessage.success("保存成功!");
      emits("save");
    });
  });
};

onMounted(() => {
  console.info("onBeforeUnmount ...");
  initEditor();
});

onBeforeUnmount(() => {
  console.info("onBeforeUnmount ...");
  if (editor) {
    editor.dispose();
  }
});

watch(
  modelVale,
  (value) => {
    // console.info("value =>", value);
    if (editor) {
      editor.setValue(value as string);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-monaco-editor";

.@{prefix-cls} {
  --at-apply: w-full h-full;
  // border: 1px solid red;
}
</style>
