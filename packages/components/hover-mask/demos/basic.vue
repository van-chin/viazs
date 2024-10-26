<template>
  <div class="bd-red">
    <vz-hover-mask>
      <div class="w-full">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          bordered
          :pagination="false"
        />
      </div>

      <template #mask>
        <div class="mask-contents">
          <a-button>配置数列</a-button>
        </div>
      </template>
    </vz-hover-mask>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";

const activeColumnKey = ref<string>();

const dataSource = [
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
];

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
];

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

const initial = {
  name: "zs",
  age: 18,
  address: "xxx",
};

const dragEnded = (data) => {
  console.info("dragEnded =>", data);
};
</script>

<style lang="less">
.mask-contents {
  --at-apply: "w-full h-full flex justify-center items-center";
}
</style>
