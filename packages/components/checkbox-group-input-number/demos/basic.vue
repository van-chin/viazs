<template>
  <div class="bd-red p-2">

    checkedValue:{{ checkedValue }}
    inputValue:{{ inputValue }}
    <vz-checkbox-group-input-number :options="options" v-model:value="inputValue"
      v-model:checked="checkedValue"></<vz-checkbox-group-input-number>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const checkedValue = ref([]);

const inputValue = ref();

const options = [
  { label: '不限', value: '0', disabled: false },
  { label: '开单', value: '1', disabled: false },
  { label: '划扣', value: '2', disabled: false },
  { label: '其他', value: '3', disabled: false },
];

</script>

<style lang="less">
.mask-contents {
  --at-apply: "w-full h-full flex justify-center items-center";
}
</style>
