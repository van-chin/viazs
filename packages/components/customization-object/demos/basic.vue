<template>
	<div class="">
		<vz-json-viewer :data="configurationedValue"></vz-json-viewer>
		<VzConfigurationObject
			v-model:value="configurationedValue"
		></VzConfigurationObject>
	</div>
</template>

<script setup lang="ts">
	import { ref, h } from "vue";
	const configurationedValue = ref<{}>({
		aa: "aa",
		bb: "bb",
	});
</script>

<style lang="less">
	.mask-contents {
		--at-apply: "w-full h-full flex justify-center items-center";
	}
</style>
