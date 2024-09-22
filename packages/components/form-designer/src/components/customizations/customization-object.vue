<template>
	<div>
		<!-- <div>{{ modelValueArr }}</div> -->

		<div :class="prefixCls" ref="draggableElRef">
			<div
				:class="`${prefixCls}-item`"
				:key="item.id"
				v-for="(item, index) in modelValueArr"
			>
				<div class="handler flex justify-center items-center">
					<iconify-icon
						icon="ant-design:menu-outlined"
						width="1.2rem"
						height="1.2rem"
						class="cursor-move text-#888"
					></iconify-icon>
				</div>
				<div>
					<fieldset :class="`${prefixCls}-item-fieldset`">
						<legend :class="`${prefixCls}-item-fieldset-legend`">
							key
						</legend>

						<a-input placeholder="key" v-model:value="item.key">
						</a-input>
					</fieldset>
				</div>
				<div>
					<fieldset :class="`${prefixCls}-item-fieldset`">
						<legend :class="`${prefixCls}-item-fieldset-legend`">
							value
						</legend>

						<VzDesignerCustomizationPropValue
							:valueTypes="valueTypes"
							v-model:value="item.value"
							v-model:valueType="item.valueType"
						></VzDesignerCustomizationPropValue>
					</fieldset>
				</div>

				<div class="del flex justify-center items-center">
					<iconify-icon
						@click="onRemoveItem(index)"
						icon="ant-design:delete-outlined"
						class="cursor-pointer text-#888 hover:text-red"
						width="1.2rem"
						height="1.2rem"
					></iconify-icon>
				</div>
			</div>

			<a-button block type="dashed" @click="onAddItem">添加参数</a-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { nanoid } from "nanoid";
	import { ref, reactive, watch } from "vue";
	import { useDraggable } from "vue-draggable-plus";
	import { sortBy } from "lodash-es";
	import VzDesignerCustomizationPropValue from "./customization-prop-value.vue";

	const COMPONENT_NAME = "VzDesignerCustomizationObject";
	defineOptions({
		name: COMPONENT_NAME,
	});
	interface VzDesignerCustomizationObjectProps {
		/**  类型 */
		options?: [];
		/** 数据模式 */
		mode: "api" | "custom" | "context";
	}

	interface DataOption {
		id: string;
		value: string;
		label: string;
		[K: string]: string;
	}

	interface ParamOption {
		id: string;
		key: string;
		value: string;
		status: boolean;
	}

	defineProps<VzDesignerCustomizationObjectProps>();
	const { prefixCls } = useStyle("designer-customization-object");
	const draggableElRef = ref<HTMLElement>();
	const paramsRef = ref<HTMLElement>();
	const modelValue = defineModel<any>("value", {
		default: {},
	});

	const modelValueArr = ref([]);

	useDraggable(draggableElRef, modelValueArr, {
		animation: 150,
		handle: ".handler",
		ghostClass: "ghost",
	});

	(async function init() {
		console.info("dddddddddddddddddddddd");
		Object.keys(modelValue.value).forEach((v) => {
			console.info(
				"modelValue.value[v] type =>",
				Object.prototype.toString.call(modelValue.value[v])
			);
			let valueType = "string";
			if (
				Object.prototype.toString.call(modelValue.value[v]) ===
				"[object String]"
			) {
				valueType = "string";
			}
			if (
				Object.prototype.toString.call(modelValue.value[v]) ===
				"[object Number]"
			) {
				valueType = "number";
			}

			if (
				Object.prototype.toString.call(modelValue.value[v]) ===
				"[object Boolean]"
			) {
				valueType = "boolean";
			}

			if (
				Object.prototype.toString.call(modelValue.value[v]) ===
				"[object Object]"
			) {
				valueType = "object";
			}
			if (Array.isArray(modelValue.value[v])) {
				valueType = "array";
			}
			let o = {
				id: nanoid(),
				key: v,
				value: modelValue.value[v],
				valueType: valueType,
			};

			modelValueArr.value.push(o);
		});

		console.info("modelValueArr =>", modelValueArr.value);
	})();

	const onAddItem = () => {
		console.info("dd");

		let o = {
			id: nanoid(),
			key: "newKey",
			value: "newValue",
			valueType: "string",
		};

		modelValueArr.value.push(o);
	};

	const onRemoveItem = (index: number) => {
		modelValueArr.value.splice(index, 1);
	};

	watch(
		() => modelValueArr.value,
		(values) => {
			let modelValueObject = {};
			values.forEach((item) => {
				console.info("item.value =>", item.key, item.value);
				modelValueObject[item.key] = item.value;
			});

			console.info("modelValueObject =>", modelValueObject);

			modelValue.value = modelValueObject;
		},
		{ immediate: false, deep: true }
	);

	// const testVss = reactive(Object.entries(testMv));

	// const valueTypes = [
	//   {
	//     label: "STRING",
	//     value: "string",
	//     key: 1,
	//     title: "字符串",
	//   },
	//   {
	//     label: "NUMBER",
	//     value: "number",
	//     key: 2,
	//     title: "数值",
	//   },
	//   {
	//     label: "BOOLEAN",
	//     value: "boolean",
	//     key: 3,
	//     title: "布尔值",
	//   },
	//   {
	//     label: "ARRAY",
	//     value: "array",
	//     key: 4,
	//     title: "数组",
	//   },
	//   {
	//     label: "OBJECT",
	//     value: "object",
	//     key: 5,
	//     title: "数组",
	//   },
	// ];

	const valueTypes = [
		{
			label: "STR",
			value: "string",
			key: 1,
			title: "字符串",
		},
		{
			label: "NUM",
			value: "number",
			key: 2,
			title: "数值",
		},
		{
			label: "BOOL",
			value: "boolean",
			key: 3,
			title: "布尔值",
		},
		{
			label: "ARR",
			value: "array",
			key: 4,
			title: "数组",
		},
		{
			label: "OBJ",
			value: "object",
			key: 5,
			title: "数组",
		},
	];
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-designer-customization-object";

	.@{prefix-cls} {
		background-color: #eeeeee;
		--at-apply: w-full p-2 rd;
		&-item {
			background-color: #fff;
			--at-apply: "rd p-2 mb-2";
			display: grid;
			grid-template-columns: 20px 1fr 2fr 20px;
			grid-gap: 8px;

			&-fieldset {
				border: 1px solid #f0f0f0;
				--at-apply: px-1 py-1;
				&-legend {
					--at-apply: "px-1 py-0 text-#0000004f italic";
				}
			}

			&-gitem {
				background-color: rgba(21, 147, 201, 0.8);
			}
		}
	}
</style>
