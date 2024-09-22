<template>
	<div :class="prefixCls">
		<div ref="draggableRef" v-show="mode === 'custom'">
			<a-space
				:size="3"
				:class="`${prefixCls}-item`"
				:key="item.id"
				v-for="(item, index) in modelValue"
			>
				<div class="handler">
					<Icon
						icon="ant-design:menu-outlined"
						style="font-size: 16px"
						:inline="true"
						class="cursor-move text-[#888]"
					></Icon>
				</div>
				<a-input
					placeholder="标签"
					v-model:value="item.label"
					title="label / 标签"
				>
					<!-- <template #prefix>
            <span class="text-#0000004f text-10px">label</span>
          </template> -->
				</a-input>
				<!-- <a-input placeholder="值" v-model:value="item.value">
          <template #prefix>
            <span class="text-#0000004f text-10px">value</span>
          </template>
        </a-input> -->
				<VzDesignerCustomizationPropValue
					:valueTypes="valueTypes"
					v-model:value="item.value"
				></VzDesignerCustomizationPropValue>
				<Icon
					@click="onDeleteItem(index)"
					icon="ant-design:delete-outlined"
					style="font-size: 16px"
					:inline="true"
					class="cursor-pointer text-[#888] hover:text-red"
				></Icon>
			</a-space>
			<a-button block type="dashed" @click="addItem">添加选项</a-button>
		</div>
		<div v-show="mode === 'api'">
			<div>
				<div class="text-[12px] text-[#070c14] cursor-pointer mb-2">
					接口 <span>{{ modelApi.protocol }} / {{ modelApi.path }}</span>
				</div>
				<div class="p-2 bg-[#fff] rd mb-2">
					<a-input v-model:value="modelApi.path">
						<template #addonBefore>
							<a-select
								v-model:value="modelApi.protocol"
								allowClear
								style="width: 90px"
							>
								<a-select-option value="http://"
									>http://</a-select-option
								>
								<a-select-option value="https://"
									>https://</a-select-option
								>
							</a-select>
						</template>
						<template #addonAfter>
							<!-- <setting-outlined /> -->
							<Icon
								icon="ant-design:api-outlined"
								:inline="true"
								class="cursor-pointer text-[#888] hover:text-red"
							></Icon>
						</template>
					</a-input>
				</div>

				<div class="text-[12px] text-[#070c14] cursor-pointer mb-2">
					参数
				</div>
				<div ref="paramsRef">
					<!-- {{  modelParams  }} -->
					<!-- :valueTypes="valueTypes" -->
					<VzConfigurationObject

						v-model:value="modelParams"
					></VzConfigurationObject>


					<!-- <a-space
						:size="3"
						:class="`${prefixCls}-item`"
						:key="item.id"
						v-for="(item, index) in modelParams"
					>
						<div class="handler">
							<Icon
								icon="ant-design:menu-outlined"
								style="font-size: 16px"
								:inline="true"
								class="cursor-move text-[#888]"
							></Icon>
						</div>
						<div>
							<a-checkbox
								v-model:checked="item.status"
							></a-checkbox>
						</div>
						<a-input placeholder="key" v-model:value="item.key">
							<template #prefix>
								<span class="text-[#0000004f] text-[10px]"
									>key</span
								>
							</template>
						</a-input>
						<a-input placeholder="value" v-model:value="item.value">
							<template #prefix>
								<span class="text-[#0000004f] text-[10px]"
									>value</span
								></template
							>
						</a-input>
						<Icon
							@click="onDeleteParamItem(index)"
							icon="ant-design:delete-outlined"
							style="font-size: 16px"
							:inline="true"
							class="cursor-pointer text-[#888] hover:text-red"
						></Icon>
					</a-space>
					<a-button block type="dashed" @click="addParamItem"
						>添加参数</a-button
					> -->
				</div>
			</div>
		</div>
		<div
			v-show="mode === 'context'"
			class="flex justify-between items-center"
		>
			<a-input placeholder="请输入表达式"></a-input>

			<Icon
				icon="iconoir:fx"
				style="font-size: 16px"
				:inline="true"
				class="cursor-pointer text-[#888] hover:text-red ml-2"
			></Icon>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { nanoid } from "nanoid";
	import { ref } from "vue";
	import { useDraggable } from "vue-draggable-plus";
	import VzDesignerCustomizationPropValue from "./customization-prop-value.vue";

	const COMPONENT_NAME = "VzDesignerCustomizationOptions";
	defineOptions({
		name: COMPONENT_NAME,
	});
	interface VzDesignerCustomizationOptionsProps {
		/**  类型 */
		options?: [];
		/** 数据模式 */
		mode: "api" | "custom" | "context";
	}

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
	];

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

	defineProps<VzDesignerCustomizationOptionsProps>();
	const { prefixCls } = useStyle("designer-customization-options");
	const draggableRef = ref<HTMLElement>();
	const paramsRef = ref<HTMLElement>();
	const modelValue = defineModel<DataOption[]>("value", {
		default: [],
	});

	const modelApi = defineModel<object>("api", {
		default: {
			protocol: "",
			hpp: "",
			path: "",
		},
	});

	const configurationedValue = ref({});

	const modelParams = defineModel<ParamOption[]>("params", {
		default: [],
	});

	useDraggable(draggableRef, modelValue, {
		animation: 150,
		handle: ".handler",
		ghostClass: "ghost",
	});

	useDraggable(paramsRef, modelParams, {
		animation: 150,
		handle: ".handler",
		ghostClass: "ghost",
	});

	const addParamItem = () => {
		let itemId = nanoid();
		modelParams.value.push({
			id: itemId,
			key: `k-${itemId}`,
			value: `v-${itemId}`,
			status: true,
		});
	};

	const addItem = () => {
		let itemId = nanoid();
		modelValue.value.push({
			id: itemId,
			value: `选项-${itemId}`,
			label: `选项-${itemId}`,
		});
	};
	const onDeleteItem = (index: number) => {
		modelValue.value.splice(index, 1);
	};

	const onDeleteParamItem = (index: number) => {
		modelParams.value.splice(index, 1);
	};
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-designer-customization-options";

	.@{prefix-cls} {
		background-color: #eeeeee;
		--at-apply: w-full p-2 rd;
		&-item {
			background-color: #fff;
			--at-apply: "rd p-2 mb-2";
		}
	}
</style>
