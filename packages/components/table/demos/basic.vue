<template>
	<div class="h-400px">
		<vz-table
			:paginations="{ pageSize: 10 }"
			:lists="dataSource"
			:columns="columns"
			rowKey="key"
			@dragEnd="dragEnded"
			:actions="actions"
		>
			<template #bodyCell="{ column, text, record }">
				<template v-if="column.key === 'operations'">
					<vz-button type="link" gapless>确认</vz-button>
					<vz-button type="link" gapless>接待</vz-button>
					<vz-button type="link" gapless>取消</vz-button>
					<!-- <vz-button type="link" gapless>改期</vz-button> -->
				</template>
			</template>
		</vz-table>
	</div>
</template>

<script setup lang="ts">
	import { event } from "@visactor/vtable/es/tools/helper";
	import { ref } from "vue";

	const customRender = ({ text, record, index, column }) => {
		return text;
	};

	const dragEnded = (data) => {
		console.info("dragEnded =>", data);
	};


	const columns = [
		{
			title: "姓名",
			dataIndex: "name",
			key: "name",
			ellipsis: { showTitle: true },
			formatType: 5,
			customRender: customRender,
			events: {
				click: ["value"],
			},
			width: 100,
			fixed: "left",
		},
		{
			title: "年龄",
			dataIndex: "age",
			key: "age",
			width: 200,
		},
		{
			title: "住址",
			dataIndex: "address",
			key: "address",
			width: 300,
		},
		{
			title: "年龄",
			dataIndex: "age",
			key: "age",
			width: 200,
		},
		{
			title: "住址",
			dataIndex: "address",
			key: "address",
			width: 300,
		},
		{
			title: "操作",
			dataIndex: "operations",
			width: 140,
			key: "operations",
			fixed: "right",
		},
	];

	const actions = [
		{
			position: "ro",
			component: "VzButton",
			props: {
				type: "link",
				text: "查看",
				gapless: true,
				size: "small",
			},
			emit: "curd-detail",
		},
		{
			position: "ro",
			component: "VzButton",
			props: {
				type: "link",
				text: "编vv辑",
				gapless: true,
			},
			emit: "curd-edit",
		},
		{
			position: "ro",
			component: "VzPopconfirmButton",

			props: {
				canConfirm: false,
				type: "link",
				text: "删除xxx",
				title: "确定要删除此数据么?",
				gapless: true,
			},
			emit: "curd-destroy",
		},
		// {
		//   position: "ro",
		//   component: "VzPopconfirmButton",
		//   props: {
		//     canConfirm: false,
		//     type: "link",
		//     text: "恢复",
		//     title: "确定要恢复此数据么?",
		//     gapless: true,
		//   },
		//   emit: "curd-recovery",
		// },
	];


	const dataSource = ref([
		{
			key: "1",
			name: "胡彦斌西湖区湖底公园1号-西湖区湖底公园1号-西湖区湖底公园1号",
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
