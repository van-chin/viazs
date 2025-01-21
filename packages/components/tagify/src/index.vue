<template>
  <div :class="[prefixCls, 'w-full']">
    {{ modelValue }}
    <input
      ref="tagify"
      :class="`${prefixCls}-tags w-full`"
      aria-expanded="true"
      name="input-custom-dropdown"
      class="tagify--custom-dropdown"
      placeholder="Type an English letter"
      :value="`${JSON.stringify(modelValue)}`"
      
    />
  </div>
</template>

<script lang="ts" setup>
import type { VzTagifyProps,VzTag } from "@viaz/types";

import { useTemplateRef, onMounted, ref, nextTick } from "vue";

import Tagify from "@yaireo/tagify";

import "@yaireo/tagify/dist/tagify.css";

import { useStyle } from "@viaz/hooks";

const { prefixCls } = useStyle("tagify");

const COMPONENT_NAME = "VzTagify";
defineOptions({
  name: COMPONENT_NAME,
});

const { tags = [] } = defineProps<VzTagifyProps>();




const modelValue = defineModel<VzTag[]>("value", { default: [] });

// console.info("tags => ", tags);

const tagifyRef = useTemplateRef("tagify");

const tagify = ref<Tagify>();



onMounted(() => {

  console.info("onMounted tagifyRef => ", tagifyRef.value);



  tagify.value = new Tagify(tagifyRef.value, {
    tagTextProp: "value",
    
    whitelist: tags,
    maxTags: 10,
    
    // transformTag:(tagData)=>{
    //   console.info("transformTag => ", tagData);
    //   return tagData.value
    // },
    // mode: "mix",
    dropdown: {
      enabled: 0,
      closeOnSelect: false,
      maxItems: 20,
      classname: "tags-look",
    },
  });

  // tagify.value.on("add", (e) => {
  //   console.log("added tag data:", e);
  // });

  tagify.value.on("add", (e) => {
    console.log("added tag data:", e.detail.data);
    modelValue.value.push(e.detail.data);

    console.info("modelValue => ", modelValue.value);
  });
});
</script>

<style lang="less">
.tags-look .tagify__dropdown__item {
  display: inline-block;
  vertical-align: middle;
  border-radius: 3px;
  padding: 0.3em 0.5em;
  border: 1px solid #ccc;
  background: #f3f3f3;
  margin: 0.2em;
  font-size: 0.85em;
  color: black;
  transition: 0s;
}

.tags-look .tagify__dropdown__item--active {
  border-color: black;
}

.tags-look .tagify__dropdown__item:hover {
  background: lightyellow;
  border-color: gold;
}

.tags-look .tagify__dropdown__item--hidden {
  max-width: 0;
  max-height: initial;
  padding: 0.3em 0;
  margin: 0.2em 0;
  white-space: nowrap;
  text-indent: -20px;
  border: 0;
}
</style>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-tagify";

.@{prefix-cls} {
  &-tags {
    // border: 2px solid red !important;
  }
}
</style>
