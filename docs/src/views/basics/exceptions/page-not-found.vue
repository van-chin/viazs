<template>
	<div :class="prefixCls">
		<vz-button text="sss">not-found</vz-button>
	</div>
</template>

<script lang="ts" setup>
	import { useStyle } from "viaz";

	const { prefixCls } = useStyle("not-found");

	const COMPONENT_NAME = "button";
	defineOptions({
		name: COMPONENT_NAME,
	});
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-not-found";

	.@{prefix-cls} {
		--at-apply: w-full h-full;
	}
</style>
