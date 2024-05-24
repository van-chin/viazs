<template>
	<div :class="prefixCls">
		<overlay-scrollbars-component
			ref="scrollbarRef"
			class="overlayscrollbars-vue h-full"
			:options="{
				scrollbars: {
					autoHide: 'leave',
					autoHideDelay: 1,
				},
			}"
			@os-scroll="onScroll"
		>
			<slot></slot>
		</overlay-scrollbars-component>

		<div :class="`${prefixCls}-spin elevation-6 p-2`" v-if="modelLoading">
			<a-spin :spinning="modelLoading">
				<template #indicator>
					<span>
						<iconify-icon
							icon="line-md:loading-twotone-loop"
							width="1.4rem"
							height="1.4rem"
							:inline="true"
						></iconify-icon>
						<span class="ml-2">{{ loadingTip }}</span>
					</span>
				</template>
			</a-spin>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	// import { UseOverlayScrollbarsInstance } from "overlayscrollbars-vue"
	import type { OverlayScrollbars } from "overlayscrollbars";
	import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

	import { ref, toRefs } from "vue";

	import type { VzOverlayScrollbarProps } from "@viaz/types";

	import "overlayscrollbars/overlayscrollbars.css";

	const COMPONENT_NAME = "VzOverlayScrollbar";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const props = withDefaults(defineProps<VzOverlayScrollbarProps>(), {
		loadingTip: "加载中...",
	});

	const modelLoading = defineModel("loading", {
		required: false,
		default: false,
	});

	const { loadingTip } = toRefs(props);

	const emits = defineEmits<{
		"scroll-bottom": [];
	}>();

	const { prefixCls } = useStyle("overlay-scrollbar");
	const scrollbarRef = ref();

	const onScroll = (osInstance: OverlayScrollbars, event) => {
		if (
			event.srcElement.scrollHeight ===
			event.srcElement.scrollTop + event.srcElement.clientHeight
		) {
			emits("scroll-bottom");
		}
	};

	const onUpdated = (osInstance, onUpdatedArgs) => {
		console.info("onUpdated.osInstance =>", osInstance);
		console.info("onUpdated.onUpdatedArgs =>", onUpdatedArgs);
	};

	function scrollTo(payload) {
		scrollbarRef.value
			?.osInstance()
			?.elements()
			?.viewport?.scrollTo(payload);
	}

	defineExpose({
		scrollTo,
		instance: scrollbarRef.value,
	});
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-overlay-scrollbar";

	.@{prefix-cls} {
		--at-apply: w-full h-full;
		position: relative;
		&-spin {
			--at-apply: w-full flex justify-center items-center bg-white;
			position: absolute;
			bottom: 0;

			::v-deep(.ant-spin-dot) {
				--at-apply: w-200px h-28px flex justify-center items-center
					text-12px bg-white;
			}
		}
	}
</style>
