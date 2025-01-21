<template>
	<a-select
		:class="prefixCls"
		v-bind="$attrs"
		:options="dataOptions"
		:loading="loading"
	></a-select>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { useWatcher } from "alova/client";
	import { alovaInstance } from "@viaz/utils";
	import ASelect from "ant-design-vue/es/select";
	import type { VzSelectProps } from "@viaz/types";
	import { ref, watch } from "vue";
	const { prefixCls } = useStyle("select");
	const COMPONENT_NAME = "VzSelect";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const dataOptions = ref<VzSelectProps["options"]>([]);
	const {
		api = { path: "/" },
		options,
		params = {},
		immediate = false,
	} = defineProps<VzSelectProps>();

	console.info("params =>", params);

	const { loading, data, send, onSuccess } = useWatcher(
		() => {
			let url = "/";
			if (api) {
				url = api.path;
			}
			// 暂未处理 protocol hostname
			return alovaInstance.Get<VzSelectProps["options"]>(url, {
				cacheFor: 0,
				params: parseParams(params),
			});
		},
		// params 或 api 发生变化，重新发起请求
		[api, params],
		{
			initialData: [],
			immediate: immediate,
		}
	);
	onSuccess(() => {
		dataOptions.value = data.value;
	});

	const parseParams = (params: any) => {
		if (Array.isArray(params)) {
			let parsedParams: Record<string, string | number | boolean> = {};
			params.forEach((item) => {
				if (item.status === true) {
					parsedParams[item.key] = item.value;
				}
			});
			return parsedParams;
		} else {
			return params;
		}
	};

	if (options && options.length >= 1) {
		dataOptions.value = options;
	} else {
		if (Array.isArray(params)) {
			let requestParams = parseParams(params);
			console.info("requestParams =>", requestParams);
			send(requestParams);
		} else {
			send(params);
		}
	}


</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-select";

	.@{prefix-cls} {
		--at-apply: min-w-[100px] w-full;
	}
</style>
