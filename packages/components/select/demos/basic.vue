<template>
	<div>
		

		<vz-select
			:api="api"
			:params="params"
			
			:fieldNames="fieldNames"
			placeholder="请选择"
		></vz-select>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const api = ref({
		hpp: "oms/v1/dataDictionaryItems",
	});

	const params = ref({
		page: 1,
		pageSize: 1000,
		isShowTree: 0,
		dataDictionaryId: "205703429370236110307",
	});

	const fieldNames = ref({
		label: "name",
		value: "id"
	});
</script>
