<template>
  <div class="bd-red p-2">

    <p>
      checkedValue:{{ checkedValue }}
    </p>
    <p>
      valueValue:{{ valueValue }}
    </p>


    <vz-checkbox-date-range-picker :checkbox-label="checkboxLabel" :placeholder="['开始日期', '结束日期']"
      v-model:checked="checkedValue" v-model:value="valueValue"></vz-checkbox-date-range-picker>

   
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";

const checkboxLabel = ref('有效期');

const checkedValue = ref(true);

const valueValue = ref([]);

</script>

<style lang="less">
.mask-contents {
  --at-apply: "w-full h-full flex justify-center items-center";
}
</style>
