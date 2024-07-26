<template>
	<div class="h-400px">
		<vz-button type="link" @click="onTest">测试</vz-button>
		<vz-page
			row-key="id"
			:actions="curdActions"
			:store="reservationStore"
			:tables="tables"
			@inited="onInited"
			:ref="toRef('page')"
		>
			<template #bodyCell="{ column, text, record }">
				<template v-if="column.key === 'operations'">
					<vz-button type="link" gapless>确认</vz-button>
					<vz-button type="link" gapless>接待</vz-button>
					<vz-button type="link" gapless>取消</vz-button>
				</template>
			</template>
		</vz-page>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRefs } from "viaz";

	import { useReservationStore } from "@/stores/modules/hiss/reservationStore";
	// import { useReservationStore } from './stores/reservationStore';

	console.info("useReservationStore =>", useReservationStore);

	const reservationStore = useReservationStore();

	const { refs, toRef } = useRefs<{
		/** 页面Ref */
		page: InstanceType<typeof HTMLElement>;
	}>();

	const tables = {
		rowKey: "id",
		pagination: false,
		sortable: true,
		expandFixed: "right",
	};

	const onTest = () => {
		console.info("refs =>", refs.page);
	};

	const onInited = (data) => {
		console.info("onInited", data);
	};

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

	const curdActions = [
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
				text: "编辑",
				gapless: true,
			},
			emit: "curd-edit",
		},
		// {
		//   position: "ro",
		//   component: "VzPopconfirmButton",

		//   props: {
		//     canConfirm: false,
		//     type: "link",
		//     text: "删除",
		//     title: "确定要删除此数据么?",
		//     gapless: true,
		//   },
		//   emit: "curd-destroy",
		// },
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
