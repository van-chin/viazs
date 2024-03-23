<template>
  <VzListCheckboxGroup
    v-model:value="testValue"
    :itemNumber="6"
    :api="{ hpp: 'oms/v1/categorizes/categories/withServiceItems' }"
    :params="[
      {
        key: 'isShowTree',
        value: 1,
      },
      {
        key: 'rootId',
        value: '208593802814241639859',
      },
    ]"
  ></VzListCheckboxGroup>

  <VzJsonViewer :data="testValue"></VzJsonViewer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const testValue = ref([
  "806594161283998156405",
  "806594162131549554857",
  "806594162139598422102",
  "806594161964955992391",
  "806594161968336601701",
  "806594162130475813143",
  "806594162131419529265",
  "806594161968198189264",
  "806594162130744247008",
  "806594162134208743434",
]);
</script>
