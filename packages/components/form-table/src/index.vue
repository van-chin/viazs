<template>
	<div :class="prefixCls">
		<div :class="`${prefixCls}-action-bar`" v-if="hab">
			<div :class="`${prefixCls}-action-bar-left`"></div>
			<div :class="`${prefixCls}-action-bar-right`">
				<a-input
					placeholder="请按 名称/姓名 搜索物料"
					class="w-full"
				></a-input>
			</div>
		</div>

		<!-- {{ initial }}

    <p>
      {{ initialComponents }}
    </p> -->

		<!-- <vz-json-viewer :data="parseedColumns"></vz-json-viewer> -->

		<a-table
			:class="`${prefixCls}-antdv-table`"
			v-bind="$attrs"
			:columns="parseedColumns"
			:data-source="modelValue"
			@change="onChange"
			:rowKey="rowKey"
			ref="tableRef"
			:scroll="scroll"
			:customHeaderCell="customHeaderCell"
			:customHeaderRow="customHeaderRow"
		>
			<!-- 透传 slot  /** 开始 */  -->
			<template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
				<template v-if="name === 'headerCell'">
					<slot :name="name" v-bind="slotProps"></slot>

					<template v-if="slotProps.column.key === 'operations'">
						<div class="flex justify-between items-center">
							<span>{{ slotProps.title }}</span>

							<a-space>
								<a-dropdown
									placement="bottom"
									:trigger="['click']"
								>
									<template #overlay>
										<a-menu>
											<a-menu-item key="large">
												默认
											</a-menu-item>
											<a-menu-item key="middle">
												中等
											</a-menu-item>
											<a-menu-item key="small">
												紧凑
											</a-menu-item>
										</a-menu>
									</template>
								</a-dropdown>

								<icon
									icon="ant-design:setting-outlined"
									:inline="true"
									class="cursor-pointer"
								>
								</icon>
							</a-space>
						</div>
					</template>
				</template>

				<template v-else-if="name === 'bodyCell'">
					<template
						v-if="
							slotProps.column.formatType ===
							ColumnFormatTypeEnum.INDEX
						"
					>
						{{
							(paginations?.current - 1) * paginations?.pageSize +
							slotProps.index +
							1
						}}
					</template>
					<template
						v-if="
							slotProps.column.formatType ===
								ColumnFormatTypeEnum.DATETIME ||
							slotProps.column.formatType ===
								ColumnFormatTypeEnum.DATE
						"
					>
						{{
							slotProps.text
								? unref(
										useDateFormat(
											slotProps.text,
											slotProps.column.formater
										)
								  )
								: "-"
						}}
					</template>

					<template
						v-if="
							slotProps.column.formatType ===
							ColumnFormatTypeEnum.JOIN
						"
					>
						{{
							slotProps.text
								? slotProps.text.join(slotProps.column.formater)
								: "-"
						}}
					</template>

					<template v-if="slotProps.column.key === 'operations'">
						<slot :name="name" v-bind="slotProps"></slot>
					</template>

					<template v-if="slotProps.column.key === 'index'">
						<div :class="`${prefixCls}-index-wrapper`">
							<div
								:class="`${prefixCls}-index-wrapper-index index`"
							>
								{{ calcIndex(slotProps.index) }}
							</div>
							<div
								:class="`${prefixCls}-index-wrapper-delete delete`"
							>
								<a-button
									size="small"
									danger
									shape="circle"
									@click="onDeleteRow(slotProps.index)"
								>
									<icon
										icon="ant-design:delete-outlined"
										:inline="true"
									/>
								</a-button>
							</div>
						</div>
					</template>

					<template v-else>
						<slot :name="name" v-bind="slotProps"></slot>
					</template>
				</template>

				<template v-else>
					<slot :name="name" v-bind="slotProps || {}"></slot>
				</template>
			</template>

			<!-- 透传 slot  /** 结束 */  -->

			<!-- 内置默认的（会被透出solt重写覆盖） slot   ===== 开始 ===== -->

			<!-- headerCell begin -->
			<template #headerCell="{ title, column }">
				<template v-if="column.key === 'index'">
					<div>
						<a-button
							v-if="hab === false"
							size="small"
							type="primary"
							shape="circle"
							:disabled="!allowAdd"
							@click="onAddRow"
						>
							<iconify-icon
								icon="ant-design:plus-outlined"
								:inline="true"
							></iconify-icon>
						</a-button>
						<span v-else>{{ title }}</span>
					</div>
				</template>
			</template>
			<!-- headerCell end -->

			<!-- bodyCell begin -->
			<template #bodyCell="{ column, text, record, index }">
				<template v-if="column.key === 'index'">
					<div :class="`${prefixCls}-index-wrapper`">
						<div :class="`${prefixCls}-index-wrapper-index index`">
							{{ calcIndex(index) }}
						</div>
						<div
							:class="`${prefixCls}-index-wrapper-delete delete`"
						>
							<a-button
								size="small"
								danger
								shape="circle"
								@click="onDeleteRow(index, record)"
							>
								<iconify-icon
									icon="ant-design:delete-outlined"
									:inline="true"
								></iconify-icon>
							</a-button>
						</div>
					</div>
				</template>
				<template v-else>
					<template
						v-if="
							column.component &&
							Object.getOwnPropertyNames(
								column.component
							).includes('name')
						"
					>
						<component
							:is="column.component.name"
							v-bind="record._components[column.key].props"
							v-on="parseEvents(column, index)"
							:index="index"
							:class="
								column.component.name === 'ACheckbox' ||
								column.component.name === 'ASwitch'
									? ''
									: 'w-full'
							"
							v-model:[column.component.vModelField]="
								record[column.dataIndex]
							"
						>
						</component>
					</template>
					<template v-else>
						<template v-if="column.formatType">
							<template
								v-if="
									column.formatType ===
										ColumnFormatTypeEnum.DATETIME ||
									column.formatType ===
										ColumnFormatTypeEnum.DATE
								"
							>
								{{
									text
										? unref(
												useDateFormat(
													text,
													column.formater
												)
										  )
										: "-"
								}}
							</template>

							<template
								v-if="
									column.formatType ===
									ColumnFormatTypeEnum.JOIN
								"
							>
								{{ text ? text.join(column.formater) : "-" }}
							</template>

							<template
								v-if="
									column.formatType ===
									ColumnFormatTypeEnum.TOFIXED
								"
							>
								{{

									text ? parseFloat(text).toFixed(column.formater) : text
								}}
							</template>
						</template>

						<template v-else>{{ text }}</template>
					</template>
				</template>
			</template>
			<!-- bodyCell end -->

			<!-- 内置默认的（会被透出solt重写覆盖） slot   ===== 结束 ===== -->
		</a-table>
	</div>
</template>
<script lang="ts" setup>
	import { useRequest } from "vue-hooks-plus";
	import { useStyle } from "@viaz/hooks";
	import { createNetWork } from "@viaz/utils";
	import { isFunction, isObject } from "@vue/shared";
	import type { VzFormTableProps, VzFormTableColumn } from "@viaz/types";
	import { Icon } from "@iconify/vue";
	import { cloneDeep } from "lodash-es";
	import { nanoid } from "nanoid";

	import { ColumnFormatTypeEnum } from "@viaz/enums";

	import { useDateFormat } from "@vueuse/core";

	import { useDraggable } from "vue-draggable-plus";
	import type { ComponentInternalInstance } from "vue";
	import { unref } from "vue";
	import {
		getCurrentInstance,
		ref,
		reactive,
		watch,
		computed,
		useSlots,
		toRefs,
	} from "vue";
	import type { PaginationProps } from "ant-design-vue";
	import { number } from "zod";

	const { prefixCls } = useStyle("form-table");

	const COMPONENT_NAME = "VzFormTable";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const tableRef = ref();

	// componentsClone

	const props = withDefaults(defineProps<VzFormTableProps>(), {
		rowKey: "id",
		allowAdd: true,
		draggable: true,
		componentsClone: true,
		scroll: {
			x: "max-content",
		},
	});

	const {
		api,
		options,
		params,
		initial,
		componentsClone,
		columns,
		rowKey,
		allowAdd,
		hab,
		scroll,
	} = toRefs(props);

	const modelValue = defineModel<object[]>("value", {
		default: [],
	});

	const currentInstance: ComponentInternalInstance = getCurrentInstance();

	const customHeaderRow = (columns, index) => {
		return {
			class: "vz-form-table-header-row",
		};
	};
	const emits = defineEmits<{
		added: [totality: number];
		deleted: [totality: number, index: number, item: any];
		fieldEvents: [params: any];
	}>();
	// 动态生成 emit 事件
	const emitEventHandler = (field: string, event: string, params: any) => {
		const eo = `${field}-${event}`;
		currentInstance.emitsOptions[eo] = null;
		emits(eo, params);
		emits("fieldEvents", { columnField: field, event, params: params });
	};
	const parseEvents = (column: VzFormTableColumn, index: number) => {
		if (column.component?.hasOwnProperty("events")) {
			// console.info('需要解析事件 =>',column.component,column.component.events);
			let emitsEvents: any = {};
			for (const key in column.component?.events) {
				emitsEvents[key] = (...args: any) => {
					let params: any = reactive({
						index: 0,
					});
					if (
						column.component !== undefined &&
						column.component.events !== undefined
					) {
						column.component.events[key].map(
							(pkey: string, index: number) => {
								params[pkey] = args[index];
							}
						);
					}

					params.index = calcIndex(index) - 1;
					emitEventHandler(column.key as string, key, params);
				};
			}
			return emitsEvents;
		} else {
			return {};
		}
	};

	const parseedColumns = ref<VzFormTableColumn[]>([]);
	const activeColumnKey = ref<string>();

	const customHeaderCell = (column) => {
		return {
			onClick: (event: PointerEvent) => {
				activeColumnKey.value = column.key;
				if (event.target) {
					let queryedHeaderCellNodeList = document.querySelectorAll(
						".vz-form-table-header-custom-header-cell"
					);
					queryedHeaderCellNodeList.forEach((node) => {
						node.classList.remove("active");
					});
					event.target.classList.add("active");
				}
			},
			class: "vz-form-table-header-custom-header-cell",
		};
	};

	const customCell = (record, rowIndex, column) => {
		return {
			class: [
				"vz-form-table-normal-custom-cell",
				"vz-form-table-custom-cell-" + column.key,
				{
					active: column.key === activeColumnKey.value,
				},
			],
		};
	};

	const initialComponents = ref({});

	const parseColumn = () => {
		let hasIndexColumn = false;
		parseedColumns.value = columns.value.map((column) => {
			// console.info('parseColumn .column =>',column);
			// console.info(column.title,`${column.key} =>`,column.component);
			initialComponents.value[column.key] = column.component;
			if (column.key === "index") {
				hasIndexColumn = true;
			}

			column.customHeaderCell = customHeaderCell;
			column.customCell = customCell;

			return column;
		});

		if (hasIndexColumn === false) {
			const indexArray = {
				title: "序号",
				dataIndex: "index",
				key: "index",
				fixed: "left",
				align: "center",
				width: 80,
			};
			parseedColumns.value.unshift(indexArray as VzFormTableColumn);
		}
	};

	parseColumn();

	const currentPagination = ref({
		pageSize: 10,
		current: 1,
	});

	useDraggable(".vz-form-table .ant-table-tbody", modelValue, {
		draggable: ".ant-table-row",
	});

	const onChange = (pagination: PaginationProps) => {
		currentPagination.value.current = pagination.current || 1;
		currentPagination.value.pageSize = pagination.pageSize || 10;
	};

	const calcIndex = (index: number) => {
		return (
			(currentPagination.value.current - 1) *
				currentPagination.value.pageSize +
			index +
			1
		);
	};

	const onAddRow = () => {
		let clonedInitial = cloneDeep(initial.value);
		let nanoId = nanoid();
		clonedInitial[rowKey.value] = nanoId;
		clonedInitial.key = "key-" + nanoId;
		clonedInitial.dataIndex = "dataIndex" + nanoId;
		clonedInitial["_components"] =
			componentsClone.value === true
				? cloneDeep(initialComponents.value)
				: initialComponents.value;
		if (!modelValue.value) {
			modelValue.value = [];
		}
		modelValue.value.push(clonedInitial);
		emits("added", modelValue.value.length);
	};

	const onDeleteRow = (index: number, item: any) => {
		// console.info("onDeleteRow =>");
		modelValue.value.splice(index, 1);

		emits("deleted", modelValue.value.length, index, item);
	};

	const { data, loading, run } = useRequest(
		() => {
			if (isFunction(api.value)) {
				return api.value(params.value);
			}
			if (isObject(api.value)) {
				const network = createNetWork() as any;
				return network.get({
					url: api.value.uri,
					params: params.value,
				});
			}
		},
		{
			manual: true,
		}
	);

	const getOptions = () => {
		if (options.value) {
			// optionsData.value = options;
			data.value = options.value;
			return;
		} else {
			run();
			return;
		}
	};

	(async () => {
		getOptions();
	})();

	watch(
		() => params.value,
		() => {
			getOptions();
			// run();
		},
		{
			deep: true,
		}
	);

	watch(
		() => options.value,
		() => {
			getOptions();
		},
		{
			deep: true,
		}
	);
</script>

<style lang="less">
	.vz-form-table-antdv-table {
		.vz-form-table-header-row {
			.vz-form-table-header-custom-header-cell.active {
				background-color: #e6f4ff;
				// outline: 1px solid red !important;
				// border: 1px solid #1890ff !important;
			}
		}

		.ant-table-tbody {
			.vz-form-table-normal-custom-cell.active {
				background-color: #e6f4ff !important;
				// outline: 1px solid red !important;
				// border: 1px solid #1890ff !important;
			}
		}
	}
</style>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-form-table";

	.@{prefix-cls} {
		--at-apply: min-w-100px w-full;

		&-header-item {
			// border: 1px solid red;
			// outline: 2px solid #1890ff;
		}

		&-header-item.active {
			// border: 1px solid red; #e6f4ff
			outline: 2px solid #1890ff;
		}

		&-action-bar {
			--at-apply: flex justify-between items-center p-2 mb-2;
		}

		// border: 1px solid red;
		&-index-wrapper {
			// border: 1px solid red;

			height: 24px;
			min-height: 24px;
			--at-apply: flex justify-center items-center;

			&-index {
				// display: none;
			}

			&-delete {
				display: none;
			}

			&:hover {
				// background-color: red;
				.index {
					display: none;
				}

				.delete {
					display: block;
				}
			}
		}
	}
</style>

<style>
	.ims-form-table {
		.ant-table-cell {
			.ant-select-selection-placeholder {
				text-align: left;
			}

			.ant-select-selection-item {
				text-align: left;
			}
		}
	}

	.ims-form-table-select-popup {
		.ant-select-item-option {
			text-align: left;
		}
	}
</style>
