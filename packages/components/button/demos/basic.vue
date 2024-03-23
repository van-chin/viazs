<template>
  <a-space>
    <vz-button text="abc" @click="onClick">sssss</vz-button>
    <vz-button text="abc">sssss</vz-button>

    <VzPopconfirmButton text="提交">sss</VzPopconfirmButton>
  </a-space>

  <VzSectionTitle>测试</VzSectionTitle>
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
