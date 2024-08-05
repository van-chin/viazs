<template>
	<div :class="prefixCls" ref="draggableElRef">
		<div>
			<!-- {{ modelValue }}
      <VzJsonViewer title="modelValue" :data="modelValue"></VzJsonViewer> -->
			<vz-hover-mask>
				<a-table
					:dataSource="modelValue"
					:columns="previewColumns"
					size="small"
					bordered
					:pagination="false"
				>
				</a-table>
				<template #mask>
					<div class="w-full h-full flex justify-center items-center">
						<a-button @click="onConfigRule">配置数列</a-button>
					</div>
				</template>
			</vz-hover-mask>
		</div>
	</div>

	<vz-modal v-model:open="opening" title="数列配置" width="100%">
		<div :class="`${prefixCls}-modal-wrap`" class="w-full h-full">
			<vz-form-table
				:initial="initial"
				v-model:value="modelValue"
				:columns="columns"
				bordered
				row-key="id"
				:pagination="false"
			>
				<template #bodyCell="{ column, text, record, index }">
					<template v-if="['key', 'title'].includes(column.key)">
						<a-input v-model:value="record[column.key]"></a-input>
					</template>
					<template v-if="column.dataIndex === 'dataIndex'">
						<VzConfigurationValue
							:valueTypes="valueTypes"
							v-model:value="record[column.key]"
						></VzConfigurationValue>
					</template>

					<template v-if="column.dataIndex === 'width'">
						<a-input-number
							v-model:value="record[column.key]"
						></a-input-number>
					</template>

					<template v-if="column.dataIndex === 'formatType'">
						<a-select
							class="w-[100px]"
							allowClear
							v-model:value="record[column.key]"
							placeholder="请选择格式化类型"
							:options="formatTypeOptions"
						></a-select>
					</template>

					<template v-if="column.dataIndex === 'ellipsis'">
						<a-switch v-model:checked="record[column.key]" />
					</template>

					<template v-if="column.dataIndex === 'align'">
						<a-select
							class="w-[100px]"
							allowClear
							v-model:value="record[column.key]"
							placeholder="请选择 对齐方式"
							:options="alignOptions"
						></a-select>
					</template>

					<template v-if="column.dataIndex === 'fixed'">
						<a-select
							class="w-[100px]"
							allowClear
							v-model:value="record[column.key]"
							placeholder="请选择固定位置"
							:options="fixedOptions"
						></a-select>
					</template>

					<template v-if="column.dataIndex === 'formater'">
						<a-input v-model:value="record[column.key]"></a-input>
					</template>

					<!-- <template v-if="column.dataIndex === 'preview'">
            <component :is="record.component.name" v-bind="record.component.props"></component>
          </template> -->
					<template v-if="column.key === 'component'">
						<!-- <vz-json-viewer :data="column" title="column"></vz-json-viewer> -->
						<!-- <vz-json-viewer :data="record" title="record"></vz-json-viewer> -->
						<div class="flex justify-between items-center">
							<div class="flex-1">
								<a-select
									class="w-full"
									allowClear
									@change="
										(value, option) =>
											onComponentChange(
												value,
												option,
												record
											)
									"
									:fieldNames="{
										label: 'title',
										value: 'componentName',
									}"
									v-model:value="record[column.key].name"
									placeholder="请选择组件"
									:options="componentLists"
								>
									<template #option="item">
										<div>{{ item.title }}</div>
										<div
											class="text-[#0000004f] italic"
											style="font-size: 10px !important"
										>
											{{ item.type }}
										</div>
									</template>
								</a-select>
							</div>
							<a-button
								type="link"
								:disabled="
									!record.component.hasOwnProperty('type') ||
									record.component.type === ''
								"
								@click="onConfigurationProps(record, index)"
								>属性</a-button
							>
						</div>
					</template>
				</template>
			</vz-form-table>

			<div
				:class="`${prefixCls}-modal-wrap-content`"
				:style="{ display: propsOpen ? 'block' : 'none' }"
			>
				<div :class="`${prefixCls}-modal-wrap-content-comp-props`">
					<div
						:class="`${prefixCls}-modal-wrap-content-comp-props-title`"
					>
						<a-typography-text strong>组件属性</a-typography-text>
						<div class="flex items-center">
							<iconify-icon
								icon="ant-design:close-outlined"
								@click="onConfigurationPropsClose"
								class="cursor-pointer hover:text-red"
							></iconify-icon>
						</div>
					</div>
					<div
						:class="`${prefixCls}-modal-wrap-content-comp-props-content`"
					>
						<vz-overlay-scrollbar>
							<div class="px-2">
								<template
									v-for="item in activedRowComponentProps"
								>
									<template
										v-if="
											['events', 'class'].includes(
												item.field
											)
										"
									>
										<VzDesignerCustomizationProp
											v-if="item.show !== false"
											v-bind="item"
											v-model:value="
												activeRowComponent[item.field]
											"
											v-model:apply="item.apply"
										>
										</VzDesignerCustomizationProp>
									</template>
									<template v-else>
										<VzDesignerCustomizationProp
											v-if="item.show !== false"
											v-bind="item"
											v-model:value="
												activeRowComponent.props[
													item.field
												]
											"
											v-model:params="
												activeRowComponent.props[
													'params'
												]
											"
											v-model:api="
												activeRowComponent.props['api']
											"
											v-model:apply="item.apply"
											v-model:mode="item.mode"
										>
										</VzDesignerCustomizationProp>
									</template>
								</template>
							</div>
						</vz-overlay-scrollbar>
					</div>
				</div>
			</div>
		</div>
	</vz-modal>
</template>
<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";
	import { nanoid } from "nanoid";
	import { ref, reactive, watch } from "vue";
	import { useDraggable } from "vue-draggable-plus";

	import type { SelectProps } from "ant-design-vue/es/select";

	// import formItemRulePropsJson from "../../data/rule-props.json";

	// import VzDesignerCustomizationPropValue from "./customization-prop-value.vue";

	import VzDesignerCustomizationProp from "./customization-prop.vue";
	import componentLists from "../../data/component-lists.json";
	import componentProps from "../../data/component-props.json";
	const COMPONENT_NAME = "VzDesignerCustomizationColumns";
	defineOptions({
		name: COMPONENT_NAME,
	});
	interface VzDesignerCustomizationColumnsProps {
		/**  类型 */
		options?: [];
		/** 数据模式 */
		mode: "api" | "custom" | "context";
	}

	const opening = ref(false);

	const currentIndex = ref(0);

	const propsOpen = ref(false);

	const onConfigRule = () => {
		opening.value = true;
	};
	const activeRowComponent = ref({});
	const activedRowComponentProps = ref([]);

	const initial = {
		title: "表头-1",
		key: "key-1",
		dataIndex: "dataIndex-1",
		width: 100,
		component: {
			name: "AInput",
			vModelField: "value",
			type: "input",
			props: {
				placeholder: "请输入",
			},
		},
	};

	const onConfigurationProps = (record: any, index: number) => {
		// activeRowComponent.value = record.component.props;
		activeRowComponent.value = record.component;
		activedRowComponentProps.value = componentProps[record.component.type];

		propsOpen.value = true;
	};

	const onConfigurationPropsClose = (index: number) => {
		console.info("onConfigurationProps => index", index);
		propsOpen.value = false;
	};

	const valueTypes = [
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
			label: "ARRAY",
			value: "array",
			key: 4,
			title: "数组",
		},
	];

	const formatTypeOptions = ref([
		{
			name: "date",
			label: "日期",
			value: 1,
			color: "blue",
			icon: "ant-design:check-outlined",
		},
		{
			name: "datetime",
			label: "时间",
			value: 2,
			color: "blue",
			icon: "ant-design:close-outlined",
		},
		{
			name: "index",
			label: "序号",
			value: 3,
			color: "blue",
			icon: "ant-design:close-outlined",
		},
		{
			name: "join",
			label: "联合",
			value: 4,
			color: "blue",
			icon: "ant-design:close-outlined",
		},
	]);

	const alignOptions = [
		{
			label: "LEFT",
			value: "left",
			key: 1,
			title: "靠左",
		},

		{
			label: "CENTER",
			value: "center",
			key: 4,
			title: "居中",
		},
		{
			label: "RIGHT",
			value: "right",
			key: 2,
			title: "靠右",
		},
	];

	const fixedOptions = [
		{
			label: "LEFT",
			value: "left",
			key: 1,
			title: "左侧",
		},
		{
			label: "RIGHT",
			value: "right",
			key: 2,
			title: "右侧",
		},
	];

	const previewColumns = [
		{
			title: "TITLE 表头",
			dataIndex: "title",
			key: "title",
			align: "center",
		},
		{
			title: "KEY 标识",
			dataIndex: "key",
			key: "key",
			align: "center",
		},
	];

	const columns = [
		{
			title: "序号",
			dataIndex: "index",
			key: "index",
			fixed: "left",
			align: "center",
			width: 80,
		},
		{
			title: "TITLE",
			dataIndex: "title",
			key: "title",
			align: "center",
			component: {
				name: "AInput",
				vModelField: "value",
				props: {
					placeholder: "请输入 表头",
				},
			},
		},
		{
			title: "KEY",
			dataIndex: "key",
			key: "key",
			align: "center",
			component: {
				name: "AInput",
				vModelField: "value",
				props: {
					placeholder: "请输入 KEY",
				},
			},
		},
		{
			title: "DATAINDEX",
			dataIndex: "dataIndex",
			key: "dataIndex",
			align: "center",
			component: {
				name: "VzConfigurationValue",
				vModelField: "value",
				props: {
					placeholder: "请输入 KEY",
				},
			},
		},
		{
			title: "WIDTH",
			dataIndex: "width",
			key: "width",
			align: "center",
			component: {
				name: "AInputNumber",
				vModelField: "value",
				props: {
					placeholder: "请输入 宽度",
				},
			},
		},

		// formatType: 2,
		// formater: 'YYYY-MM-DD HH:mm:ss',
		{
			title: "FORMATTYPE",
			dataIndex: "formatType",
			key: "formatType",
			align: "left",
			width: 120,
			component: {
				name: "ASelect",
				vModelField: "value",
				props: {
					placeholder: "请选择格式化类型",
					options: [
						{
							name: "date",
							label: "日期",
							value: 1,
							color: "blue",
							icon: "ant-design:check-outlined",
						},
						{
							name: "datetime",
							label: "时间",
							value: 2,
							color: "blue",
							icon: "ant-design:close-outlined",
						},
						{
							name: "index",
							label: "序号",
							value: 3,
							color: "blue",
							icon: "ant-design:close-outlined",
						},
						{
							name: "join",
							label: "联合",
							value: 4,
							color: "blue",
							icon: "ant-design:close-outlined",
						},
					],
				},
			},
		},
		{
			title: "FORMATER",
			dataIndex: "formater",
			key: "formater",
			align: "center",
			component: {
				name: "ASelect",
				vModelField: "value",
				props: {
					placeholder: "请输入 格式器",
				},
			},
		},
		{
			title: "ALIGN",
			dataIndex: "align",
			key: "align",
			align: "center",
			component: {
				name: "ASelect",
				vModelField: "value",
				props: {
					placeholder: "请选择对齐方式",
				},
			},
		},
		{
			title: "ELLIPSIS",
			dataIndex: "ellipsis",
			key: "ellipsis",
			align: "center",
			component: {
				name: "ASwitch",
				vModelField: "checked",
				props: {},
			},
		},
		{
			title: "FIXED",
			dataIndex: "fixed",
			key: "fixed",
			align: "center",
			component: {
				name: "ASelect",
				vModelField: "value",
				props: {
					placeholder: "请输入 格式器",
				},
			},
		},
		// {
		//   title: "COMPONENT preview",
		//   dataIndex: "preview",
		//   key: "preview",
		//   align: "center",
		//   component: {
		//     name: "VzConfigurationValue",
		//     vModelField: "value",
		//     props: {
		//       placeholder: "请输入 KEY",
		//     },
		//   },
		// },
		{
			title: "COMPONENT",
			dataIndex: ["component", "name"],
			key: "component",
			with: 400,

			component: {
				name: "ASelect",
				vModelField: "value",
				props: {
					options: [],
					placeholder: "请选择 组件",
					allowClear: true,
				},
			},
		},
	];

	defineProps<VzDesignerCustomizationColumnsProps>();
	const { prefixCls } = useStyle("designer-customization-columns");

	const modelValue = defineModel<any>("value", {
		default: [],
	});

	const onComponentChange = (value, option, record) => {
		console.info("option =>", option.vModelField);
		if (value) {
			record.component.type = option.type;
			record.component.vModelField = option.vModelField;
			record.component.props = option.component.props;
			// record.component.vModelField = option.component.props
		} else {
			record.component = {};
		}
	};

	(async function init() {
		console.info("modelValue =>", modelValue);
	})();
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-designer-customization-columns";

	.@{prefix-cls} {
		background-color: #eeeeee;
		--at-apply: w-full p-2 rd;

		&-modal-wrap {
			// border: 1px solid;

			position: relative;

			&-content {
				display: none;
				right: 0;
				top: 0;
				bottom: 0;
				position: absolute;

				--at-apply: shadow-sm;

				height: 100%;

				&-comp-props {
					border: 1px solid #f0f0f0;

					background-color: #fff;

					--at-apply: w-[400px] h-full flex flex-col rd;

					&-title {
						border-bottom: 1px solid #f0f0f0;
						--at-apply: h-[40px] flex items-center justify-between
							px-2 shadow-sm;
					}

					&-content {
						--at-apply: flex-1 min-h-[100px];
					}
				}
			}
		}

		.component-configuration-gird {
			border: 2px solid red;
		}

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
					--at-apply: "px-1 py-0 text-[#0000004f] italic";
				}
			}

			&-gitem {
				background-color: rgba(21, 147, 201, 0.8);
			}
		}
	}
</style>
