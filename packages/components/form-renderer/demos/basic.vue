<template>
  <div class="">
    <div class="mb-2">
      <a-space>
        <a-button @click="getFormData">获取数据</a-button>
        <a-button @click="resetForm">重置</a-button>
      </a-space>
    </div>
    <!-- {{ list }} -->
    <vz-json-viewer :data="list.model"></vz-json-viewer>
    <vz-form-renderer @tb-name-change="onTbNameChange" ref="formRenderer" @keywords-pressEnter="onKeywordsPressEnter"
      :data="list">
      <template #test-demo="data">
        <div class="bd-red">test-demo slot contents  {{ data }} </div>
      </template>
    </vz-form-renderer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { VzFormSchema } from "viaz";

import type { CheckboxChange } from "@viaz/types";

import data from "./data.json";
import { update } from "lodash-es";
const list = ref<VzFormSchema>(data);

const formRenderer = ref();

onMounted(() => {
  console.info("formRenderer =>", formRenderer.value);
});

const onTbNameChange = (data: any) => {
  console.info('onNameChange 透传事情 监听 nbnb => xxxxxxxxxxxxx', data);
  const { index, value } = data;
  console.info('formRenderer.value.formInstance =>', formRenderer.value);
  // let findedNode = formRenderer.value.findComponentNode('tb');
  // console.info('findedNode =>', findedNode);

  // /api/mers/v1/departments

  // isShowTree 1 
  // merchantId 0 // affiliationedOrganizations

  // let path = ['tb', index, '_components', 'age', 'props', 'disabled'];
  let path = [index, '_components', 'age', 'props', 'disabled'];
  // console.info('')
  // // list.value.model.tb[index]['_components']

  // update(list.value.model, path, () => {
  //   if (value === '选项一') {
  //     return true;
  //   }
  //   return false;
  // });

  // formRenderer.value.updateComponentProp('aaa','item.label','测试修改');
  let updatedValue = true;


  updatedValue = value === '选项一' ? false : true;
  formRenderer.value.updateFormModel('tb', updatedValue, path);

  // formRenderer.value.updateFormModel('tb','选项三','aa.bb');

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

const onKeywordsPressEnter = () => {
  console.info('onKeywordsPressEnter =>xxx');
}

</script>
