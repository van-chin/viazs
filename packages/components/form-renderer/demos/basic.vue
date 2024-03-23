<template>
  <div class="">
    <div class="mb-2">
      <a-space>
        <a-button @click="getFormData">获取数据</a-button>
        <a-button @click="resetForm">重置</a-button>
      </a-space>
    </div>
    <vz-form-renderer ref="formRenderer" :data="list"></vz-form-renderer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { VzFormSchema } from "viaz";

import data from "./data.json";

const list = ref<VzFormSchema>(data);

const formRenderer = ref();

onMounted(() => {
  console.info("formRenderer =>", formRenderer.value);
});

const getFormData = () => {
  console.info("getFormData =>", formRenderer.value.formInstance.modelRef);
};

const resetForm = () => {
  formRenderer.value.formInstance.resetFields();
};
</script>
