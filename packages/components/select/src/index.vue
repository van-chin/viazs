<template>
	<div>
		<!-- {{ data }} -->
		<a-select
			:class="prefixCls"
			v-bind="$attrs"
			:options="dataOptions"
			:loading="loading"
		></a-select>
		<a-button @click="handleSend">发送</a-button>
	</div>
</template>
<script lang="ts" setup>
	import { useRequest } from "alova/client";
	import { useStyle } from "@viaz/hooks";
	import { alovaInstance } from "@viaz/utils";
	import { VzSelectProps, DataApi } from "@viaz/types";
	import type { SelectProps } from "ant-design-vue";

	import { ref, toRefs, watch } from "vue";

	const { prefixCls } = useStyle("select");

	console.info("alovaInstance =>", alovaInstance);

	const COMPONENT_NAME = "VzSelect";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const dataOptions = ref<SelectProps["options"]>([]);

	const props = defineProps<VzSelectProps>();

	const { api, options = [], params } = toRefs(props);

	// const response = await alovaInstance
	// 	.Get("https://alovajs.dev/user/profile")
	// 	.then((response) => response.json());

	// console.log("🚀 ~ file: index.vue:37 ~ response:", response);

	// const { data, loading, run } = useRequest(
	// 	() => {
	// 		if (isFunction(api)) {
	// 			return api(params.value);
	// 		}
	// 		if (isObject(api)) {
	// 			const network = createNetWork({}) as any;

	// 			let tmpParams = parseParams();

	// 			return network.get({
	// 				url: generateUrl(api.value as DataApi),
	// 				params: tmpParams,
	// 			});
	// 		}
	// 	},
	// 	{
	// 		manual: true,
	// 	}
	// );

	const parseParams = () => {
		let parsedParams: Record<string, string | number | boolean> = {
			aa: "aa",
		};
		params.value?.forEach((item) => {
			if (item.status === true) {
				parsedParams[item.key] = item.value;
			}
		});

		console.info("parsedParams =>", parsedParams);

		return parsedParams;
	};
	const generateUrl = (apiData: DataApi) => {
		let url = "";
		if (apiData.protocol !== undefined) {
			url = `${apiData.protocol}${apiData.hpp}`;
		} else {
			url = apiData.hpp as string;
		}
		console.info("url =>", url);
		return url;
	};

	const { loading, data, error, send, update, onSuccess } = useRequest(
		alovaInstance.Get(generateUrl(api.value as DataApi), {
			cacheFor: 0,
			params: parseParams(),
		}),
		{
			// 设置为 {} 或 不设置 正常运行，设置为数组，项目就会崩掉
			initialData: [],
			immediate: false,
		}
	);

	onSuccess(async (event) => {
		// console.info("onSuccess data =>", data.value);

		dataOptions.value = data.value || [];
		// console.info("onSuccess event =>", event.data.json());
		// console.info("onSuccess method =>", method);
		// console.info("onSuccess.method =>", event.method);
		// console.info("onSuccess.data =>", event.data);
		// event.method; // 当前请求的method
		// event.data; // 当前请求的响应数据

		// if (event.data.bodyUsed === false) {
		// 	let tmp;
		// 	tmp = await event.data.json();

		// 	console.info("tmp =>", tmp.data);

		// 	dataOptions.value = tmp.data || [];
		// }
	});

	const handleSend = () => {
		send();
	};
	const handleUpdate = () => {
		update({
			data: { title: "new title" },
		});

		// 也可以直接修改data值
		// data.value = { title: 'new title' };
	};

	// handleSend();
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-select";

	.@{prefix-cls} {
		--at-apply: min-w-100px w-full;
	}
</style>
