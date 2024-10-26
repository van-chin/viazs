<template>
  <div class="">
    <vz-form-table rowKey="id" :allow-add="false" @name-change="onNameChange" :columns="columns" bordered :initial="initial"
      v-model:value="dataSource"></vz-form-table>

    <VzJsonViewer class="h-200px" :data="dataSource"></VzJsonViewer>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";

const activeColumnKey = ref<string>();


const onNameChange = ({ index, e }) => {
  console.info('onNameChange index=>', index);
  console.info('onNameChange e=>', e);
}

const customHeaderCell = (column) => {
  return {
    onClick: (event: PointerEvent) => {
      activeColumnKey.value = column.key;
      let queryedHeaderCellNodeList = document.querySelectorAll(
        ".vz-form-table-header-custom-header-cell"
      );
      queryedHeaderCellNodeList.forEach((node) => {
        node.classList.remove("active");
      });
      event.target.classList.add("active");
    },
    class: "vz-form-table-header-custom-header-cell",
  };
};

const customCell = (record, rowIndex, column) => {
  return {
    class: [
      "vz-form-table-normal-custom-cell",
      "vz-form-table-custom-cell-" + column.key,
      {
        active: column.key === activeColumnKey.value,
      },
    ],
  };
};

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    customHeaderCell: customHeaderCell,
    customCell: customCell,
    component: {
      name: "AInput",
      vModelField: "value",
      events: {
        "change": [
          "e",
        ]
      },
      props: {
        placeholder: "请输入姓名",
      },
    },
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
    actived: false,
    customCell: customCell,
    customHeaderCell: customHeaderCell,

    component: {
      name: "AInputNumber",
      vModelField: "value",
      props: {
        placeholder: "请输入年龄",
      },
    },
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
    customCell: customCell,
    customHeaderCell: customHeaderCell,
    component: {
      name: "AInput",
      vModelField: "value",
      props: {
        placeholder: "请输入地址",
      },
    },
  },
];

const initial = {
  name: "zs",
  age: 18,
  address: "xxx",
};

const dragEnded = (data) => {
  console.info("dragEnded =>", data);
};

const dataSource = ref([]);
</script>
