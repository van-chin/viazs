<template>
	<div>
		<a-space class="mb-2">
			<a-button @click="onChange">change</a-button>

			<a-button @click="onChangeApi">change Api</a-button>
		</a-space>

		<vz-select
			:api="api"
			:params="params"
			:options="options"
			:fieldNames="fieldNames"
			placeholder="请选择"
		></vz-select>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const fieldNames = {
		label: "name",
		value: "id",
	};

	const params = ref({
		key: "aa",
		value: "123",
		page: 1,
		timestamp: 1111,
	});

	const api = ref({
		path: "stage/v1/nodes",
	});

	const onChange = () => {
		params.value.timestamp = new Date().getTime();
		params.value.page = Math.floor(Math.random() * 10) + 1;
	};

	const onChangeApi = () => {
		api.value.path =
			"stage/v1/nodes?time=" + Math.floor(Math.random() * 10) + 1;
	};

	const options = [
		{ id: "jack", name: "Jack" },
		{ id: "lucy", name: "Lucy" },
		{ id: "Yiminghe", name: "yiminghe" },
		{ id: "disabled", name: "Disabled", disabled: true },
	];
</script>
