<template>
  <div>
    <VzUploaderUppy></VzUploaderUppy>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "viaz";

const onClick = () => {
  console.info("vvvvv");
  const { createMessage } = useMessage();

  createMessage.success({
    content: "复制成功",
    duration: 5,
  });
};
</script>
