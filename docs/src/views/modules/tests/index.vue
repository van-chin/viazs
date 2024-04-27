<template>
	<div :class="prefixCls">
		<div class="p-2 font-bold elevation-6 bd-red mb-2 animated animated-bounce">pragmatic-drag-and-drop</div>
		<div class="w-full">
			<div
				class="test-wraper"
				:ref="toRef('testWraperRef')"
				id="testWraperRef"
			>
				<div class="item" v-for="n in 4">{{ n }} - item</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useStyle } from "viaz";
	import { onMounted, ref } from "vue";
	import { useRefs } from "viaz";
	// import { draggable } from "@atlaskit/pragmatic-drag-and-drop/adapters/element";
	import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

	const { prefixCls } = useStyle("tests");

	const COMPONENT_NAME = "Tests";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const { refs, toRef } = useRefs<{
		testWraperRef: InstanceType<typeof HTMLElement>;
	}>();

	onMounted(() => {
		console.info("refs =>", refs);
		console.info("refs.testWraperRef =>", refs.testWraperRef);
		const cleanup = draggable({
			element: refs.testWraperRef,
		});

		console.log("🚀 ~ file: index.vue:10 ~ cleanup:", cleanup);
	});
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-tests";

	.@{prefix-cls} {
		--at-apply: w-full h-full;

		.test-wraper {
			// border: 2px solid red;
			.item {
				border: 1px solid gray;
				--at-apply: p-2 mb-2;
			}
		}
	}
</style>
