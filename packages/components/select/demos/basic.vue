<template>
	<div>
		<div>444</div>
		<VzSelect
			:api="{
				hpp: 'stage/v1/nodes',
			}"
			:params="[{ key: 'aa', value: '123' }]"
			:fieldNames="fieldNames"
			placeholder="请选择"
		></VzSelect>
	</div>
</template>

<script setup lang="ts">
	const fieldNames = {
		label: "name",
		value: "id",
	};

	const options = [
		{ value: "jack", label: "Jack" },
		{ value: "lucy", label: "Lucy" },
		{ value: "Yiminghe", label: "yiminghe" },
		{ value: "disabled", label: "Disabled", disabled: true },
	];

	console.info("options xx =>", options);
</script>
