<template>
  <div class="h-400px">
    <vz-table
      :paginations="{ pageSize: 10 }"
      :lists="dataSource"
      :columns="columns"
      rowKey="key"
      @dragEnd="dragEnded"
    ></vz-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "操作",
    dataIndex: "operations",
    key: "operations",
  },
];

const dragEnded = (data) => {
  console.info("dragEnded =>", data);
};

const dataSource = ref([
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "3",
    name: "胡彦祖3333",
    age: 44,
    address: "西湖区湖底公园1号",
  },
]);
</script>
