<template>
	<div :class="prefixCls">
		<a-flex gap="small">
			<div class="w-[105px] flex items-center">
				<a-select
					class="w-[105px]"
					v-model:value="valueType"
					:options="valueTypes"
					placeholder="值类型"
				>
					<template #option="itemData">
						<div>{{ itemData.label }}</div>

						<div
							class="text-[#0000004f] italic"
							style="font-size: 10px !important"
						>
							{{ itemData.title }}
						</div>
					</template>
				</a-select>
			</div>
			<div class="flex-1 flex items-center">
				<a-input
					class="w-full"
					:title="modelValue"
					v-if="valueType === 'string'"
					placeholder="请输入"
					v-model:value="(modelValue as string)"
				></a-input>

				<a-input-number
					class="w-full"
					v-if="valueType === 'number'"
					v-model:value="(modelValue as number)"
				></a-input-number>

				<a-switch
					v-if="valueType === 'boolean'"
					v-model:checked="(modelValue as boolean)"
				></a-switch>

				<a-select
					v-if="valueType === 'array'"
					class="w-full"
					v-model:value="(modelValue as [])"
					mode="tags"
					style="width: 100%"
					:token-separators="[',']"
					placeholder="请输入数组的值"
				></a-select>

				<div class="array-item" v-if="valueType === 'object'">
					<a-popover trigger="click" placement="bottom">
						<template #content>
							<div class="w-[600px]">
								<VzConfigurationObject
									v-model:value="(modelValue as {})"
								></VzConfigurationObject>
							</div>
						</template>
						<span class="cursor-pointer">配置</span>
					</a-popover>
				</div>
			</div>
		</a-flex>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { ref, watch, toRefs } from "vue";

	import type { VzConfigurationValueProps } from "@viaz/types";

	const COMPONENT_NAME = "VzConfigurationValue";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const props = withDefaults(defineProps<VzConfigurationValueProps>(), {
		field: "ss",
		type: "string",
		valueTypes: [
			{
				label: "STRING",
				value: "string",
				key: 1,
				title: "字符串",
			},
			{
				label: "NUMBER",
				value: "number",
				key: 2,
				title: "数值",
			},
			{
				label: "BOOLEAN",
				value: "boolean",
				key: 3,
				title: "布尔值",
			},
			{
				label: "ARRAY",
				value: "array",
				key: 4,
				title: "数组",
			},
			{
				label: "OBJECT",
				value: "object",
				key: 5,
				title: "对象",
			},
		],
	});

	const { valueTypes } = toRefs(props);

	const { prefixCls } = useStyle("configuration-value");

	const modelValue = defineModel<string | number | boolean | [] | object>(
		"value"
	);

	const valueType = defineModel<string>("valueType", {
		default: "string",
	});

	// watch(
	//   modelValue,
	//   (newModelValue) => {
	//     console.info("typeof newModelValue =>");
	//     if (typeof newModelValue === "undefined") {
	//       valueType.value = "string";
	//     } else {
	//       valueType.value = typeof newModelValue;
	//     }
	//   },
	//   {
	//     immediate: true,
	//   }
	// );

	watch(
		valueType,
		(newValueType) => {
			console.info("newValueType =>", newValueType);
			if (newValueType === "string") {
				modelValue.value = "";
			}
			if (newValueType === "number") {
				modelValue.value = 0;
			}
			if (newValueType === "boolean") {
				modelValue.value = true;
			}
			if (newValueType === "array") {
				modelValue.value = [];
			}
			if (newValueType === "object") {
				modelValue.value = {};
			}
		},
		{
			immediate: false,
		}
	);
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-configuration-value";

	.@{prefix-cls} {
		--at-apply: w-full;
	}
</style>
