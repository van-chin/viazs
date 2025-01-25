<template>
  <div :class="prefixCls">
    <Dashboard :uppy="uppy" :props="dashboardProps" />
  </div>
</template>

<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import { ref } from "vue";
import type { VzUploaderUppyProps } from "@viaz/types";

import { Dashboard } from "@uppy/vue";
import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import Audio from "@uppy/audio";
import ScreenCapture from "@uppy/screen-capture";
import ImageEditor from "@uppy/image-editor";
import DropTarget from "@uppy/drop-target";
import XHR from "@uppy/xhr-upload";
// import StatusBar from '@uppy/status-bar';
import ThumbnailGenerator from "@uppy/thumbnail-generator";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";
import "@uppy/screen-capture/dist/style.css";
import "@uppy/audio/dist/style.min.css";

import "@uppy/drop-target/dist/style.css";

import "@uppy/image-editor/dist/style.min.css";

import "@uppy/status-bar/dist/style.min.css";

import zh_CN from "@uppy/locales/lib/zh_Cn";
import Tus, { type TusBody } from "@uppy/tus";

const { prefixCls } = useStyle("uploader-uppy");

const COMPONENT_NAME = "VzUploaderUppy";
defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzUploaderUppyProps>(), {
  url: "xxx",
});

const dashboardProps = ref({
  metaFields: [
    { id: "name", name: "文件名称", placeholder: "请输入 文件名" },
    { id: "remark", name: "备注", placeholder: "请输入 备注" },
    // { id: "license", name: "License", placeholder: "specify license" },
  ],
});

const metaFields = ref([
  { id: "name", name: "Name", placeholder: "file name" },
  { id: "license", name: "License", placeholder: "specify license" },
]);

console.log("🚀 ~ file: index.vue:22 ~ props  v2:", props);

const uppy = new Uppy({
  locale: zh_CN,
  debug: true,
  allowMultipleUploadBatches: true,
}).use(Webcam);

uppy.use(ImageEditor).use(DropTarget, {
  target: document.body,
});
uppy.use(ScreenCapture);
uppy.use(Audio);
uppy.use(ThumbnailGenerator);

// uppy.use(XHR, {
//   endpoint: "https://v.vides.dev.lan/tus",
//   method: "POST",
// });
const ONE_MB = 1024 * 1024;
uppy.use(Tus, {
  endpoint: "https://v.vides.dev.lan/tus",
  limit: 20,
  chunkSize: 1 * ONE_MB,
});

uppy.on("thumbnail:generated", (file, preview) => {
  console.info("thumbnail:generated file =>", file);
  console.info("thumbnail:generated preview =>", preview);
});
console.log("🚀 ~ file: index.vue:33 ~ uppy:", uppy);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-uploader-uppy";

.@{prefix-cls} {
  // --at-apply: bd-red;
}
</style>
