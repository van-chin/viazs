<template>
	<div :class="prefixCls">
		<a-flex gap="small">
			<div class="w-105px">
				<a-select
					class="w-105px"
					v-model:value="valueType"
					:options="valueTypes"
					placeholder="值类型"
				>
					<template #option="itemData">
						<div>{{ itemData.label }}</div>

						<div
							class="text-#0000004f italic"
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

				<!-- <a-tooltip placement="top" arrow-point-at-center>
          <template #title>{{ modelValue }}</template>
          <a-input
            class="w-full"
            :title="modelValue"
            v-if="valueType === 'string'"
            placeholder="请输入"
            v-model:value="(modelValue as string)"
          ></a-input>
        </a-tooltip> -->

				<a-input-number
					class="w-full"
					v-if="valueType === 'number'"
					v-model:value="(modelValue as number)"
				></a-input-number>

				<a-switch
					v-if="valueType === 'boolean'"
					v-model:checked="(modelValue as boolean)"
				></a-switch>

				<div class="array-item" v-if="valueType === 'array'">array</div>
				<div class="array-item" v-if="valueType === 'object'">
					object
				</div>
			</div>
		</a-flex>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { ref, watch, toRefs } from "vue";
	const COMPONENT_NAME = "VzDesignerCustomizationPropValue";
	defineOptions({
		name: COMPONENT_NAME,
	});

	/** 组件事件 */
	interface ValueType {
		label: string;
		value: string;
		key: string;
		title: string;
	}

	interface VzDesignerCustomizationPropValueProps {
		/** 事件 */
		valueTypes?: ValueType[];

		/** type 组件类型 */
		type?: string;
		/** field 配置字段 */
		field?: string;
	}

	// const valueType = ref<string>("string");

	// const { valueTypes, field } = toRefs(props);
	const {
		valueTypes = [
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
				title: "数组",
			},
		],
	} = defineProps<VzDesignerCustomizationPropValueProps>();

	const { prefixCls } = useStyle("designer-customization-prop-value");

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
			if (newValueType === "string") {
				if (
					Object.prototype.toString.call(modelValue.value) !==
					"[object String]"
				) {
					modelValue.value = "";
				}
				console.info("modelValue.value =>", modelValue.value);
			}

			if (newValueType === "number") {
				if (
					Object.prototype.toString.call(modelValue.value) !==
					"[object Number]"
				) {
					modelValue.value = 1;
				}
			}
			//

			if (newValueType === "boolean") {
				if (
					Object.prototype.toString.call(modelValue.value) !==
					"[object Boolean]"
				) {
					modelValue.value = true;
				}
			}
			if (newValueType === "array") {
				if (!Array.isArray(modelValue.value)) {
					modelValue.value = [];
				}
			}
			if (newValueType === "object") {
				if (
					Object.prototype.toString.call(modelValue.value) !==
					"[object Object]"
				) {
					modelValue.value = {};
				}
			}
		},
		{
			immediate: false,
		}
	);
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-designer-customization-prop-value";

	.@{prefix-cls} {
		--at-apply: w-full;
		// background-color: #eeeeee;
	}
</style>
