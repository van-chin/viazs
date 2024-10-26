<template>
  <div class="bd-red p-2">
    {{ checkedValue }}
    <vz-checkbox-group :options="options" v-model:value="checkedValue"  :max="2" ></vz-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";

const checkedValue = ref([]);

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
