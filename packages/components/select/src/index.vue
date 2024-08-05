<template>
	<!-- <a-select
    :class="prefixCls"
    v-bind="$attrs"
    :options="dataOptions"
  ></a-select> -->
  <div :class="prefixCls" >
	select 1234567
  </div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import type { VzSelectProps } from "@viaz/types/components/select";
	import { ref, toRefs } from "vue";

	const { prefixCls } = useStyle("select");

	const COMPONENT_NAME = "VzSelect";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const dataOptions = ref<any[]>([]);

	const props = defineProps<VzSelectProps>();
	// const props = defineProps();
	// 是类型引入的原因么

	const { api, options = [], params } = toRefs(props);
  // 修改 script 里的内容 时间 几十秒 到页面更新的时间 快分钟级了
	console.info("测试 v1script 修改 HMR  v10 =>", "vvvv");
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-select";

	.@{prefix-cls} {
		--at-apply: min-w-[100px] w-full;
	}
</style>
