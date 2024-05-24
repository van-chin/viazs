<template>
	<div :class="prefixCls">
		<VzOverlayScrollbar
			@scroll-bottom="onScrollBottom"
			v-model:loading="loading"
			:loadingTip="loadingTip"
		>
			<div v-for="item in items" class="p-2 bd-red mb-2">
				<p>test.... {{ item.id }} - {{ item.name }} -{{ prefixCls }}</p>
			</div>
		</VzOverlayScrollbar>
	</div>
</template>

<script setup lang="ts">
	import { useStyle } from "viaz";
	import { ref } from "vue";

	import { nanoid } from "nanoid";

	const { prefixCls } = useStyle("overlay-scrollbar-demo");

	const n = ref(20);

	const loading = ref(false);
	const loadingTip = ref("数据加载中...");

	const items = ref([
		{
			id: 1,
			name: "xxx",
		},
		{
			id: 2,
			name: "xxx",
		},
		{
			id: 3,
			name: "xxx",
		},
		{
			id: 4,
			name: "xxx",
		},
		{
			id: 5,
			name: "xxx",
		},
		{
			id: 6,
			name: "xxx",
		},
		{
			id: 7,
			name: "xxx",
		},
		{
			id: 8,
			name: "xxx",
		},
		{
			id: 9,
			name: "xxx",
		},
		{
			id: 10,
			name: "xxx",
		},
	]);

	const onScrollBottom = () => {
		console.info("onScrollBottom =>", "xxxx");

		if (items.value.length >= 50) {
			loading.value = false;
			// loading.value = true;
			// loadingTip.value = "数据已经全部加载";
			// setTimeout(() => {
			// 	loading.value = false;
			// }, 500);
		} else {
			loading.value = true;
			setTimeout(() => {
				for (let index = 0; index < 5; index++) {
					items.value.push({
						id: nanoid(),
						name: "xxxx",
					});
				}

				n.value += 20;
				loading.value = false;
			}, 1000);
		}
	};
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-overlay-scrollbar-demo";

	.@{prefix-cls} {
		--at-apply: w-full h-400px;
		border: 2px solid gray;
	}
</style>
