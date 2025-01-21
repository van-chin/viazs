<template>



  <vz-tagify :tags="tags" v-model:value="checkedTags"></vz-tagify>

</template>

<script setup lang="ts">
import type { VzTag } from "@viaz/types";

import { ref } from "vue";


const checkedTags = ref<VzTag[]>([
  {
	id: 1,
    name: "Tag 1",
	value: "Tag 1",
    disabled: false,
  }
]);

const tags = ref<VzTag[]>([
  {
	id: 1,
    name: "Tag 1",
	value: "Tag 1",
    disabled: false,
  },
  {
    id: 2,
    name: "Tag 2",
	value: "Tag 2",
    disabled: false,
  },
]);
</script>
