<template>
  <div class="bd-red p-2">
    <vz-checkbox-input :checkbox-label="checkboxLabel" @checkbox-change="onCheckboxChange"
      placeholder="xxxx"></vz-checkbox-input>

    {{ checkboxLabel }}
    <a-button @click="changeCheckboxLabel">change</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import type { CheckboxChange } from "@viaz/types";

const activeColumnKey = ref<string>();

const checkboxLabel = ref('有效期');

const changeCheckboxLabel = () => {
  checkboxLabel.value = Math.floor(Math.random() * 10) + 'aa';
}

// const onCheckboxChange: CheckboxChange = (c) => {
//   // console.info('onCheckboxChange =>', checked);
// }

const onCheckboxChange:CheckboxChange = (checked) => {
  console.info('onCheckboxChange =>', checked);
}

</script>

<style lang="less">
.mask-contents {
  --at-apply: "w-full h-full flex justify-center items-center";
}
</style>
