<template>
  <div class="">
    <vz-explorer
      :store="fileStore"
      v-model:value="checkedValue"
      @change="onChange"
      @item-checked-change="onItemCheckedChange"
    ></vz-explorer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFileStore } from "@/stores/modules/hiss/fileStore";
import { checkPrime } from "crypto";

const checkedValue = ref(["906722335878378164060"]);

const fileStore = useFileStore();
const onChange = (ids: string[], items: any[], current: any) => {
  // emits("change", checkedValue, checkedItems, current.value);
  console.log("onChange ids =>", ids);
  console.log("onChecked items =>", items);
  console.log("onChecked current =>", current);
};

const onItemCheckedChange = (item: any) => {
  // console.log("onItemCheckedChange item vvv =>", item);
};
</script>
