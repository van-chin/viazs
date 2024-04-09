<template>
  <div class="">
    <div class="mb-2">
      <a-space>
        <a-button @click="getFormData">获取数据</a-button>
        <a-button @click="resetForm">重置</a-button>
      </a-space>
    </div>
    {{ list }}
    <vz-form-renderer @tb-name-change="onNameChange" ref="formRenderer" @day-checkboxChange="dayCheckboxChange"
      :data="list"></vz-form-renderer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { VzFormSchema } from "viaz";

import type { CheckboxChange } from "@viaz/types";

import data from "./data.json";

const list = ref<VzFormSchema>(data);

const formRenderer = ref();

onMounted(() => {
  console.info("formRenderer =>", formRenderer.value);
});

const onNameChange = (data: any) => {
  console.info('onNameChange 透传事情 监听 nbnb => xxxxxxxxxxxxx', data);
}

const getFormData = () => {
  console.info("getFormData =>", formRenderer.value.formInstance.modelRef);
};

const resetForm = () => {
  formRenderer.value.formInstance.resetFields();
};

const dayCheckboxChange = ({ checked }: { checked: boolean }) => {
  console.info('dayCheckboxChange.checked =>', checked);
  // expired
  formRenderer.value.formInstance.modelRef.expired = checked;
  console.info('formRenderer.value.formInstance.modelRef =>', formRenderer.value.formInstance.modelRef);



}

</script>
