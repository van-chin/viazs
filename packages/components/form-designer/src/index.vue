<template>
	<div :class="prefixCls">
		<div :class="`${prefixCls}-header`" v-if="showHeader">
			<div :class="`${prefixCls}-header-logo`">LOGO</div>
			<div :class="`${prefixCls}-header-center`">Vz Designer</div>
			<div :class="`${prefixCls}-header-right`">right</div>
		</div>

		<div :class="`${prefixCls}-contents`">
			<VzDynamicPanel width="350px" placement="left" ref="dpElRef">
				<div :class="`${prefixCls}-contents-left `">
					<div :class="`${prefixCls}-contents-left-nav-bar`">
						<a-tabs
							tabPosition="left"
							class="h-full"
							:class="`${prefixCls}-contents-left-nav-bar-tabs`"
						>
							<a-tab-pane key="1">
								<template #tab>
									<div
										class="flex flex-col justify-center items-center"
									>
										<div>
											<icon icon="uiw:component"></icon>
										</div>
										<div>组件</div>
									</div>
								</template>

								<div
									:class="`${prefixCls}-contents-left-nav-bar-tabs-components`"
								>
									<div
										:class="`${prefixCls}-contents-left-nav-bar-tabs-components-components`"
									>
										<div
											:class="`${prefixCls}-contents-left-nav-bar-tabs-components-components-searcher`"
										>
											<a-input-group compact>
												<a-select
													placeholder="全部"
													allowClear
													class="w-[25%]"
												>
													<a-select-option
														value="form"
														>表单</a-select-option
													>
													<a-select-option
														value="layout"
														>布局</a-select-option
													>
												</a-select>
												<a-input
													v-model:value="
														componentKeywords
													"
													allowClear
													placeholder="搜索组件"
													@change="onFuseSeach"
													class="w-[75%]"
												>
													<template #prefix>
														<icon
															icon="ant-design:search-outlined"
														></icon>
													</template>
												</a-input>
											</a-input-group>
										</div>

										<vz-overlay-scrollbar>
											<a-empty
												v-show="
													fuseSearchLists.length === 0
												"
											/>
											<a-row
												v-show="fuseSearchLists.length"
												ref="componentsListsRef"
												id="components-lists-ref"
												:class="`${prefixCls}-contents-left-nav-bar-tabs-components-components-lists`"
											>
												<a-col
													v-for="item in fuseSearchLists"
													:span="12"
													class="p-1"
													:key="item.id"
												>
													<div
														@click="
															quickAddComponent(
																item as VzFormSchemaItem
															)
														"
														:class="`${prefixCls}-contents-left-nav-bar-tabs-components-components-lists-item`"
													>
														<div
															:class="`${prefixCls}-contents-left-nav-bar-tabs-components-components-lists-item-left`"
														>
															<icon
																class="icon"
																:icon="
																	item.icon
																"
																:inline="true"
															></icon>
															<span
																class="title"
																>{{
																	item.title
																}}</span
															>
														</div>

														<icon
															:class="`icon question-icon`"
															icon="ant-design:question-circle-outlined"
														></icon>
													</div>
												</a-col>
											</a-row>
										</vz-overlay-scrollbar>
									</div>
									<div
										:class="`${prefixCls}-contents-left-nav-bar-tabs-components-outline`"
									>
										<a-tree
											blockNode
											selectable
											:showLine="true"
											:class="`${prefixCls}-contents-left-nav-bar-tabs-components-outline-tree ${prefixCls}-components-outline-tree`"
											:showIcon="false"
											:tree-data="list.items"
											:fieldNames="fieldNames"
											:draggable="true"
											:height="300"
											@select="onOutlineSelect"
											v-model:selectedKeys="
												treeSelectedKeys
											"
										>
											<template #title="item">
												<div
													class="w-full flex justify-between items-center"
												>
													<div
														class="title-wrapper flex"
													>
														<div class="title-name">
															{{ item.title }}
														</div>
														<span
															class="ml-1 text-[#0000004f] text-[10px]"
															>{{
																item.type
															}}</span
														>
													</div>

													<a-space>
														<icon
															icon="ant-design:delete-outlined"
															class="action hover-color-[#1677ff]"
															:inline="true"
														/>
														<!-- eye-outlined -->
														<icon
															icon="ant-design:eye-invisible-outlined"
															class="action hover-color-[#1677ff]"
															:inline="true"
														/>
													</a-space>
												</div>
											</template>
										</a-tree>
									</div>
								</div>
							</a-tab-pane>
							<a-tab-pane key="2">
								<template #tab>
									<div
										class="flex flex-col justify-center items-center"
									>
										<div>
											<icon
												icon="mdi:file-tree-outline"
											></icon>
										</div>
										<div>大纲</div>
									</div>
								</template>

								<div class="tab-wrapper">
									<a-tree
										blockNode
										selectable
										:showLine="true"
										:class="`${prefixCls}-components-outline-tree`"
										:showIcon="false"
										:tree-data="list.items"
										:fieldNames="fieldNames"
										:draggable="true"
										:height="300"
										@select="onOutlineSelect"
										v-model:selectedKeys="treeSelectedKeys"
									>
										<template #title="item">
											<div
												class="w-full flex justify-between items-center"
											>
												<div class="title-wrapper flex">
													<div class="title-name">
														{{ item.title }}
													</div>
													<span
														class="ml-1 text-[#0000004f] text-[10px]"
														>{{ item.type }}</span
													>
												</div>

												<a-space>
													<icon
														icon="ant-design:delete-outlined"
														class="action hover-color-[#1677ff]"
														:inline="true"
													/>
													<!-- eye-outlined -->
													<icon
														icon="ant-design:eye-invisible-outlined"
														class="action hover-color-[#1677ff]"
														:inline="true"
													/>
												</a-space>
											</div>
										</template>
									</a-tree>
								</div>
							</a-tab-pane>
							<!-- <a-tab-pane key="3">
              <template #tab>
                <div class="flex flex-col justify-center items-center">
                  <div><icon icon="ri:code-box-line"></icon></div>
                  <div>源码</div>
                </div>
              </template>

              <div class="tab-wrapper">源码</div>
            </a-tab-pane> -->

							<a-tab-pane key="4">
								<template #tab>
									<div
										class="flex flex-col justify-center items-center"
									>
										<div>
											<icon icon="uiw:component"></icon>
										</div>
										<div>记录</div>
									</div>
								</template>

								<div class="tab-wrapper">记录</div>
							</a-tab-pane>
						</a-tabs>
					</div>
				</div>
			</VzDynamicPanel>
			<div class="flex-1 flex w-full min-w-[200px]">
				<div :class="`${prefixCls}-contents-canvas min-w-200px`">
					<div :class="`${prefixCls}-contents-canvas-tools`">
						<div :class="`${prefixCls}-contents-canvas-tools-left`">
							<a-space>
								<a-radio-group
									v-model:value="unReDo"
									class="rgi"
									size="small"
								>
									<a-radio-button value="undo">
										<icon
											icon="ion:arrow-undo-outline"
										></icon>
									</a-radio-button>
									<a-radio-button value="redo">
										<icon
											icon="ion:arrow-redo-outline"
										></icon>
									</a-radio-button>
								</a-radio-group>

								<a-radio-group
									v-model:value="elementTool"
									class="rgi"
									size="small"
									v-if="operationalView === 'design'"
								>
									<a-radio-button value="move">
										<icon icon="system-uicons:move"></icon>
									</a-radio-button>
									<a-radio-button value="selection">
										<icon
											icon="ph:selection-plus-light"
										></icon>
									</a-radio-button>
								</a-radio-group>

								<a-radio-group
									v-model:value="targetDevice"
									class="rgi"
									size="small"
								>
									<a-radio-button value="pc">
										<icon icon="iconoir:pc-check"></icon>
									</a-radio-button>
									<a-radio-button value="mobile">
										<icon icon="clarity:mobile-line"></icon>
									</a-radio-button>
								</a-radio-group>
							</a-space>
						</div>
						<div
							:class="`${prefixCls}-contents-canvas-tools-center`"
						>
							<!-- <span v-if="list.items[0].item.title">{{
              list.items[0].item.title
            }}</span>
            <span v-if="list.items[0].item.title">-</span>
            <span class="text-14px">{{ list.items[0].item.name }}</span> -->
						</div>
						<div
							:class="`${prefixCls}-contents-canvas-tools-right`"
						>
							<a-space>
								<a-radio-group
									v-model:value="fileAction"
									class="rgi"
									size="small"
								>
									<a-radio-button
										:value="item.value"
										:key="item.value"
										v-for="item in fileActions"
										@click="onFileActionChange(item)"
									>
										<icon :icon="item.icon"></icon>
									</a-radio-button>
								</a-radio-group>

								<a-radio-group
									v-model:value="operationalView"
									class="rgi"
									size="small"
								>
									<a-radio-button
										:value="item.value"
										:key="item.value"
										v-for="item in operationalViewActions"
									>
										<icon :icon="item.icon"></icon>
									</a-radio-button>
								</a-radio-group>
							</a-space>
						</div>
					</div>
					<div :class="`${prefixCls}-contents-canvas-workspace`">
						<div
							:class="`${prefixCls}-contents-canvas-workspace-view ${prefixCls}-contents-canvas-workspace-view-design`"
							v-show="operationalView === 'design'"
						>
							<vz-overlay-scrollbar>
								<a-form
									:class="`${prefixCls}-contents-canvas-workspace-view-design-form`"
									v-bind="list.items[0].item"
								>
									<nested-draggable
										@add-col="addGridCol"
										@delete="deleteItem"
										@copy="copyItem"
										:class="[
											`${prefixCls}-contents-canvas-workspace-view-design-form-draggable`,
											{
												'no-item':
													!list.items[0].children
														.length,
											},
										]"
										v-model="list.items[0].children"
									></nested-draggable>
								</a-form>
							</vz-overlay-scrollbar>
						</div>
						<div
							:class="`${prefixCls}-contents-canvas-workspace-view ${prefixCls}-contents-canvas-workspace-view-json`"
							v-show="operationalView === 'json'"
						>
							<VzMonacoEditor
								v-if="operationalView === 'json'"
								v-model:value="jsonValue"
								language="json"
								@save="onJsonSave"
							>
							</VzMonacoEditor>
						</div>
						<div
							:class="`${prefixCls}-contents-canvas-workspace-view ${prefixCls}-contents-canvas-workspace-view-code`"
							v-show="operationalView === 'code'"
						>
							<!-- <VzMonacoEditor
              v-if="operationalView === 'code'"
              v-model:value="codeTemplate"
              language="html"
            ></VzMonacoEditor> -->
							<!-- <VzCodeMirror v-model:value="jsonValue"></VzCodeMirror> -->
						</div>
						<div
							:class="`${prefixCls}-contents-canvas-workspace-view ${prefixCls}-contents-canvas-workspace-view-play`"
							v-show="operationalView === 'play'"
							data-simplebar
							data-simplebar-auto-hide="false"
						>
							<vz-overlay-scrollbar>
								<div class="p-2">
									<component
										is="VzFormRenderer"
										ref="testRef"
										v-if="operationalView === 'play'"
										:data="list"
									>
									</component>
								</div>
							</vz-overlay-scrollbar>
						</div>
					</div>
					<div :class="`${prefixCls}-contents-canvas-breadcrumbs`">
						<a-breadcrumb separator=">">
							<a-breadcrumb-item
								v-for="breadcrumb in breadcrumbs"
								class="cursor-pointer"
								@click="
									breadcrumbClick(
										breadcrumb as VzFormSchemaFormOrItem
									)
								"
								>{{ breadcrumb.title }}
							</a-breadcrumb-item>
						</a-breadcrumb>
					</div>
				</div>

				<VzDynamicPanel width="350px" placement="right" ref="dpElRef">
					<div :class="`${prefixCls}-contents-right`">
						<div :class="`${prefixCls}-contents-right-header`">
							<div
								:class="`${prefixCls}-contents-right-header-tabs-wrapper`"
							>
								<a-tabs
									centered
									v-model:activeKey="formComponentProp"
								>
									<a-tab-pane
										key="form-props"
										:disabled="
											activeComponent.type ===
												'grid-layout' ||
											activeComponent.type ===
												'grid-layout-col'
										"
										tab="表单属性"
									>
									</a-tab-pane>
									<a-tab-pane
										key="component-props"
										:disabled="
											activeComponent.type ===
											'grid-layout'
										"
										tab="组件属性"
									>
									</a-tab-pane>
								</a-tabs>
							</div>
						</div>

						<div
							:class="`${prefixCls}-contents-right-props-wrapper`"
						>
							<vz-overlay-scrollbar>
								<!-- 表单属性 -->

								<div
									v-show="formComponentProp === 'form-props'"
									class="px-2"
								>
									<template
										v-for="item in activeConfigurationComponent.formItemProps"
									>
										<VzDesignerCustomizationProp
											v-bind="item"
											v-model:value="
												activeComponent.item[item.field]
											"
											@model-name-focus="
												(field, value) =>
													onModelNameFocus(
														field,
														value,
														item
													)
											"
											@model-name-change="
												(field, value) =>
													onModelNameChange(
														field,
														value,
														item
													)
											"
											@model-name-blur="
												(field, value) =>
													onModelNameBlur(
														field,
														value,
														item
													)
											"
										></VzDesignerCustomizationProp>
									</template>
								</div>

								<!-- 组件属性 -->
								<div
									v-show="
										formComponentProp === 'component-props'
									"
									class="px-2"
								>
									<template
										v-for="item in activeConfigurationComponent.componentProps"
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
													activeComponent.component[
														item.field
													]
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
													activeComponent.component
														.props[item.field]
												"
												v-model:params="
													activeComponent.component
														.props['params']
												"
												v-model:api="
													activeComponent.component
														.props['api']
												"
												v-model:apply="item.apply"
												v-model:mode="item.mode"
											></VzDesignerCustomizationProp>
										</template>
									</template>
								</div>
							</vz-overlay-scrollbar>
						</div>
					</div>
				</VzDynamicPanel>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { useStyle } from "@viaz/hooks";

	import {
		VzFormDesignerConfigurationComponent,
		VzFormDesignerProps,
		VzFormSchema,
		VzFormSchemaItem,
		VzFormSchemaForm,
		VzFormSchemaFormOrItem,
		operationalAction,
	} from "@viaz/types";

	import VzOverlayScrollbar from "../../overlay-scrollbar";

	import { useDraggable } from "vue-draggable-plus";
	import { cloneDeep, includes } from "lodash-es";
	import { toArray } from "tree-lodash";
	import { flattenTree } from "@utopia-utils/core";
	import { nanoid } from "nanoid";
	import { StorageSerializers, useStorage } from "@vueuse/core";
	import NestedDraggable from "./components/nested-draggable.vue";
	import VzDesignerCustomizationProp from "./components/customizations/customization-prop.vue";
	import type { TreeProps } from "ant-design-vue";

	import VzMonacoEditor from "../../monaco-editor";

	import Fuse from "fuse.js";

	import { ref, toRefs, reactive, watch, computed } from "vue";

	const activeStorageItem = useStorage(
		"active-item",
		{ id: "0" },
		undefined,
		{
			serializer: StorageSerializers.object,
		}
	);

	const modelKeysIndex = ref(-1);
	const props = defineProps<VzFormDesignerProps>();
	const { componentsProps, componentLists, showHeader } = toRefs(props);
	const emits = defineEmits<{
		// 数据保存事件
		save: [data?: any];
	}>();
	const COMPONENT_NAME = "VzFormDesigner";
	defineOptions({
		name: COMPONENT_NAME,
	});
	const { prefixCls } = useStyle("form-designer");

	const activeConfigurationComponent = reactive<{
		componentProps: VzFormDesignerConfigurationComponent[];
		formItemProps: VzFormDesignerConfigurationComponent[];
	}>({
		componentProps: [],
		formItemProps: componentsProps.value["form"],
	});

	const componentKeywords = ref<string>("");

	const fuseSearchLists = ref<VzFormSchemaItem[]>(componentLists.value);

	const codeTemplate = ref<string>();

	const fuseOptions = {
		keys: ["title"],
	};

	const fuse = new Fuse(componentLists.value, fuseOptions);
	const onFuseSeach = () => {
		console.info("componentKeywords.value =>", componentKeywords.value);
		if (componentKeywords.value.length) {
			const res = fuse
				.search(componentKeywords.value)
				.flatMap((item) => item.item);
			fuseSearchLists.value = res;
		} else {
			fuseSearchLists.value = componentLists.value;
		}

		// console.info("fuseSearchLists.value.res =>", res);
	};

	// 撤销 重做 Undo Redo
	const unReDo = ref<string>("");
	// 元素工具
	const elementTool = ref("");
	// 目标设备
	const targetDevice = ref<string>("pc");

	// 文件处理
	const fileActions: operationalAction[] = [
		{
			id: "download",
			icon: "ant-design:cloud-download-outlined",
			value: "download",
			label: "下载",
		},
		{
			id: "upload",
			icon: "ant-design:cloud-upload-outlined",
			value: "upload",
			label: "上传",
		},
		{
			id: "clear",
			icon: "ant-design:clear-outlined",
			value: "clear",
			label: "清空",
		},
		{
			id: "save",
			icon: "ant-design:save-outlined",
			value: "save",
			label: "保存",
		},
	];

	const fileAction = ref<string>("");

	const hexToRgba = (hexValue: string, alpha: number = 1) => {
		let rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		let hex = hexValue.replace(rgx, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});
		let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!rgb) {
			return hexValue;
		}
		let r = parseInt(rgb[1], 16);
		let g = parseInt(rgb[2], 16);
		let b = parseInt(rgb[3], 16);
		return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
	};

	// const initSchema: VzFormSchema = reactive({
	//   model: {},
	//   rules: {},
	//   items: [
	//     {
	//       id: "tHGUhT0q4Ddzuf86gjg21",
	//       key: "tHGUhT0q4Ddzuf86gjg21",
	//       title: "表单",
	//       icon: "iconoir:input-field",
	//       type: "form",
	//       vModelField: "value",
	//       item: {
	//         name: "f_9GqdghhCcT4Dr6VZp-i",
	//         colon: true,
	//         displayState: true,
	//         labelShow: true,
	//         layout: "horizontal",
	//         labelAlign: "right",
	//         labelCol: {
	//           style: {
	//             width: "100px",
	//           },
	//         },
	//       },
	//       children: [],
	//       component: {
	//         name: "AForm",
	//         props: {},
	//       },
	//       componentProps: [],
	//       formItemProps: [],
	//       class: "",
	//     },
	//   ],
	// });

	const initSchema: VzFormSchema = {
		model: {},
		rules: {},
		items: [
			{
				id: "tHGUhT0q4Ddzuf86gjg21",
				key: "tHGUhT0q4Ddzuf86gjg21",
				title: "表单",
				icon: "iconoir:input-field",
				type: "form",
				vModelField: "value",
				item: {
					name: "f_9GqdghhCcT4Dr6VZp-i",
					colon: true,
					displayState: true,
					labelShow: true,
					layout: "horizontal",
					labelAlign: "right",
					labelCol: {
						style: {
							width: "100px",
						},
					},
				},
				children: [],
				component: {
					name: "AForm",
					props: {},
				},
				componentProps: [],
				formItemProps: [],
				class: "",
			},
		],
	};

	const onFileActionChange = (fileAction: operationalAction) => {
		if (fileAction.value === "download") {
			let fileName = "vz-designer-data.json";
			let content = "data:text/json;charset=utf-8,";

			let tmpData = cloneDeep(list.value);
			let formItems = toArray(tmpData.items[0].children).filter(
				(item: any) => {
					return (
						item.type !== "grid-layout-col" &&
						item.type !== "grid-layout"
					);
				}
			);
			// 校验规则设置
			formItems.forEach((item: any) => {
				tmpData.rules[item.item.name] = item.item.rules;
			});

			content += JSON.stringify(
				tmpData,
				(key, value) => {
					if (key === "borderColor") {
						if (value.includes("#")) {
							return hexToRgba(value);
						}
						return value;
					} else {
						return value;
					}
				},
				2
			);
			const encodedUri = encodeURI(content);
			const actions = document.createElement("a");
			actions.setAttribute("href", encodedUri);
			actions.setAttribute("download", fileName);
			actions.click();
		}

		if (fileAction.value === "upload") {
			console.info("onFileActionClick 上传 =>", fileAction.value);
		}

		if (fileAction.value === "clear") {
			// 直接清空所有的配置,可以考虑 增加确认提示之后再进行清空
			list.value = initSchema;

			// 修改 breadcrumbs 为第一个
			breadcrumbs.value = [breadcrumbs.value[0]];
			// 同时更新选中项目
			activeStorageItem.value = breadcrumbs.value[0];
		}

		if (fileAction.value === "save") {
			// 保存

			let formItems = toArray(list.value.items[0].children).filter(
				(item: any) => {
					return (
						item.type !== "grid-layout-col" &&
						item.type !== "grid-layout"
					);
				}
			);

			// 校验规则设置
			formItems.forEach((item: any) => {
				list.value.rules[item.item.name] = item.item.rules;
			});
			emits("save", list.value);
		}
	};

	// 操作视图

	const operationalViewActions: operationalAction[] = [
		{
			id: "design",
			icon: "ic:outline-color-lens",
			value: "design",
			label: "设计",
		},
		{
			id: "json",
			icon: "tabler:code-dots",
			value: "json",
			label: "JSON",
		},
		{
			id: "code",
			icon: "tabler:code",
			value: "code",
			label: "代码",
		},
		{
			id: "play",
			icon: "ph:play-bold",
			value: "play",
			label: "预览",
		},
	];

	const operationalView = ref("design");

	const formComponentProp = ref<string>("form-props");

	const list = defineModel<VzFormSchema>("value", {
		required: true,
	});

	const jsonValue = ref<string>("");

	const layoutComponentsTypes = ["form", "grid-layout-col", "grid-layout"];

	const onJsonSave = () => {
		// 当json 数组 保存后，需要根据jsonValue 调整 整个list 数据，待完成
		// 主是 model 和 rules

		let updatedValue: VzFormSchema = JSON.parse(jsonValue.value);
		let modelNodes = flattenTree(updatedValue.items[0]).filter((item) => {
			return !layoutComponentsTypes.includes(item.type);
		});
		let tmpModels: Record<
			string,
			string | number | boolean | Function | string[]
		> = {};

		modelNodes.forEach((item) => {
			tmpModels[item.item.name] = item.component.props.defaultValue;

			if (item.component.props.defaultValue === undefined) {
				if (includes(arrayValueTypeComponents, item.type)) {
					// 根据类型指定值 string | []
					tmpModels[item.item.name] = [];
				} else {
					tmpModels[item.item.name] = "";
				}
			}
		});

		// list.value.model = tmpModels;
	};

	const arrayValueTypeComponents = [
		"checkbox-group",
		"date-range-picker",
		"vz-uploader",
		"vz-form-table",
	];

	const activeComponent = ref<VzFormSchemaFormOrItem>({
		id: "0",
		key: "0",
		title: "",
		icon: "",
		type: "",
		vModelField: "",
		item: {
			label: "",
			displayState: true,
			name: "",
		},
		component: { props: {}, name: "", events: {} },
		componentProps: [],
		formItemProps: [],
	});

	// @ts-ignore
	activeComponent.value = list.value.items[0] as VzFormSchemaForm;

	const breadcrumbs = ref([list.value.items[0]]);

	const componentsListsRef = ref<HTMLElement>();
	useDraggable(componentsListsRef, componentLists, {
		animation: 150,
		ghostClass: "ghost",
		group: { name: "components", pull: "clone", put: false },
		clone(item: any) {
			return buildFormItem(item, "clone");
		},
		sort: false,
	});

	const quickAddComponent = (item: VzFormSchemaItem) => {
		let buildedItem = buildFormItem(item, "click");
		list.value.items[0].children.push(buildedItem);
	};

	/** 构建生成表单项 */
	const buildFormItem = (
		item: VzFormSchemaItem,
		way: string
	): VzFormSchemaItem => {
		let addedComponent = cloneDeep(item);
		const itemId = nanoid();
		addedComponent.id = itemId;
		addedComponent.key = itemId;

		addedComponent.class = `${way}-way-${addedComponent.type}`;

		let itemName = nanoid();
		addedComponent.item.name = itemName;
		// 取消 增加组件的 componentProps & formItemProps
		// addedComponent.componentProps = componentsProps.value[addedComponent.type]; // 增加 componentProps
		// addedComponent.formItemProps = formItemProps; // 增加 formItemProps

		if (addedComponent.type === "grid-layout") {
			// addedComponent.componentProps = [];

			// addedComponent.formItemProps = [];
			addedComponent.children?.forEach((child: any) => {
				let childId = nanoid();
				child.id = childId;
				child.key = childId;
				// child.componentProps = componentsProps.value[child.type];
			});
		} else if (addedComponent.type === "Vz-form-divider") {
			console.info("不需要,增加model 和 rules");
		} else {
			// 非布局组件 增加 model 和 rules
			if (includes(arrayValueTypeComponents, addedComponent.type)) {
				// 根据类型指定值 string | []
				list.value.model[itemName] = [];
			} else {
				list.value.model[itemName] = "";
			}
			list.value.rules[itemName] = [];
		}

		return addedComponent;
	};

	// 删除 tree-data 中的指定节点
	const removeNodeInTree = (data: any, id: string) => {
		// 通过id从数组（树结构）中移除元素
		if (!data || !data.length) {
			return false;
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i].id === id) {
				data.splice(i, 1);
				break;
			}
			removeNodeInTree(data[i].children, id);
		}
	};

	const findParent = (data: any, target: any, result: any) => {
		for (let item of data) {
			if (item.id === target.id) {
				//将查找到的目标数据加入结果数组中
				//可根据需求unshift(item.id)或unshift(item)

				result.unshift(item);
				return true;
			}
			if (item.children && item.children.length > 0) {
				//根据查找到的结果往上找父级节点
				let isFind = findParent(item.children, target, result);
				if (isFind) {
					result.unshift(item);
					return true;
				}
			}
		}
		//走到这说明没找到目标
		return false;
	};

	// 删除表单节点
	const deleteItem = (data: VzFormSchemaItem) => {
		removeNodeInTree(list.value.items[0].children, data.id);
		// 同时删除 model 和 rules
		delete list.value.model[data.item.name];
		delete list.value.rules[data.item.name];
	};

	// 删除表单节点
	const copyItem = (data: any) => {
		console.info("copyItem 复制...", data);

		if (data.type !== "grid-layout" || data.type !== "grid-layout-col") {
			let tmpItem = cloneDeep(data);

			console.info("data.id =>", data.id);
			tmpItem.id = nanoid();

			console.info("tmpItem.id =>", tmpItem.id);

			list.value.items[0].children.push(tmpItem);
		} else {
			console.info("暂不支持...");
		}
	};

	/**
	 * 增加 栅格布局 的 COL
	 * @param data
	 */
	const addGridCol = (data: VzFormSchemaItem) => {
		let findedCompIndex = componentLists.value.findIndex(
			(component) => component.type === "grid-layout"
		);
		let findedComponent = componentLists.value[findedCompIndex];
		if (typeof findedComponent.children != "undefined") {
			let originalColData = cloneDeep(
				findedComponent.children[0]
			) as VzFormSchemaItem;
			originalColData.id = nanoid();
			// originalColData.componentProps = componentsProps.value["grid-layout-col"];
			if (typeof data.children != "undefined") {
				data.children.push(originalColData);
			}
		}
	};

	const onModelNameFocus = (
		field: string,
		value: string,
		item: VzFormDesignerConfigurationComponent
	) => {
		if (activeComponent.value.type !== "form") {
			let modelKeys: string[] = Object.keys(list.value.model);
			let findedIndex = modelKeys.findIndex((model) => model === value);
			modelKeysIndex.value = findedIndex;
		}
	};

	const onModelNameChange = (
		field: string,
		value: string,
		item: VzFormDesignerConfigurationComponent
	) => {
		if (activeComponent.value.type !== "form") {
			let modelKeys: string[] = Object.keys(list.value.model);
			modelKeys[modelKeysIndex.value] = value;
			list.value.model = Object.fromEntries(
				modelKeys.map((item) => {
					// 根据组件类型 设置 表单组件 model的初始值 一般为 string 或 []
					if (
						includes(
							arrayValueTypeComponents,
							activeComponent.value.type
						)
					) {
						return [item, []];
					} else if (activeComponent.value.type === "switch") {
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "undefined" ||
							typeof activeComponent.value.component.props
								.checkedValue === "boolean"
						) {
							return [item, false];
						}
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "string"
						) {
							return [item, "0"];
						}
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "number"
						) {
							return [item, 0];
						}
						return [item, ""];
					} else {
						return [item, ""];
					}
				})
			);
			let rulesKeys: string[] = Object.keys(list.value.rules);
			if (rulesKeys.length) {
				rulesKeys[modelKeysIndex.value] = value;
				list.value.rules = Object.fromEntries(
					rulesKeys.map((item) => [item, []])
				);
			}
		} else {
			if (item.field === "labelCol.style.width") {
				list.value.items[0].item.labelCol.style.width = value;
			}
		}
	};

	const onModelNameBlur = (
		field: string,
		value: string,
		item: VzFormDesignerConfigurationComponent
	) => {
		if (activeComponent.value.type !== "form") {
			let modelKeys: string[] = Object.keys(list.value.model);
			modelKeys[modelKeysIndex.value] = value;

			// list.value.model = Object.fromEntries(
			//   modelKeys.map((item) => {
			//     // 根据组件类型 设置 表单组件 model的初始值 一般为 string 或 []
			//     if (includes(arrayValueTypeComponents, activeComponent.value.type)) {
			//       return [item, []];
			//     } else {
			//       return [item, ""];
			//     }
			//   })
			// );

			list.value.model = Object.fromEntries(
				modelKeys.map((item) => {
					// 根据组件类型 设置 表单组件 model的初始值 一般为 string 或 []
					if (
						includes(
							arrayValueTypeComponents,
							activeComponent.value.type
						)
					) {
						return [item, []];
					} else if (activeComponent.value.type === "switch") {
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "undefined" ||
							typeof activeComponent.value.component.props
								.checkedValue === "boolean"
						) {
							return [item, false];
						}
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "string"
						) {
							return [item, "0"];
						}
						if (
							typeof activeComponent.value.component.props
								.checkedValue === "number"
						) {
							return [item, 0];
						}
						return [item, ""];
					} else {
						return [item, ""];
					}
				})
			);

			let rulesKeys: string[] = Object.keys(list.value.rules);
			if (rulesKeys.length) {
				rulesKeys[modelKeysIndex.value] = value;
				list.value.rules = Object.fromEntries(
					rulesKeys.map((item) => [item, []])
				);
			}
		} else {
			if (item.field === "labelCol.style.width") {
				list.value.items[0].item.labelCol.style.width = value;
			}
		}
	};

	const activeComponentChange = (
		data: any,
		updateActiveItem: boolean = true
	) => {
		let result: any[] = [];
		findParent(list.value.items, data, result);
		activeComponent.value = result[result.length - 1];
		breadcrumbs.value = result;

		if (updateActiveItem) {
			activeStorageItem.value = data;
		}
	};

	const breadcrumbClick = (breadcrumb: VzFormSchemaFormOrItem) => {
		console.log(
			"🚀 ~ file: index.vue:1276 ~ breadcrumbClick ~ breadcrumb:",
			breadcrumb
		);
		if (
			breadcrumb.id === breadcrumbs.value[breadcrumbs.value.length - 1].id
		) {
			return false;
		}
		if (breadcrumb.type === "form") {
			formComponentProp.value = "form-props";
		}
		activeComponentChange(breadcrumb);
	};

	const treeSelectedKeys = ref([]);
	const fieldNames = {
		children: "children",
		title: "title",
		key: "id",
	};

	const onOutlineSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
		const { selectedNodes } = info;
		activeComponentChange(selectedNodes[0]);
	};

	watch(
		() => activeStorageItem.value,
		(newActiveStorageItem: VzFormSchemaItem) => {
			// console.info("newActiveStorageItem =>", newActiveStorageItem.type);
			if (newActiveStorageItem.type === "form") {
				activeConfigurationComponent.componentProps = [];
				activeConfigurationComponent.formItemProps =
					componentsProps.value["form"];
			} else {
				activeConfigurationComponent.componentProps =
					componentsProps.value[newActiveStorageItem.type];
				activeConfigurationComponent.formItemProps =
					componentsProps.value["form-item"];
			}

			activeComponentChange(newActiveStorageItem, false);
		}
	);

	watch(
		list,
		(value) => {
			jsonValue.value = JSON.stringify(value, null, 2);
		},
		{
			deep: true,
			immediate: true,
		}
	);
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-form-designer";

	.@{prefix-cls} {
		--at-apply: w-full h-full flex flex-col overflow-hidden;

		.simple-bar-init {
			height: 100%;
			// border: 1px solid red;
		}

		&-header {
			--at-apply: h-48px min-h-48px flex justify-between items-center;

			border-bottom: 1px solid #eaeaea;

			&-logo {
				--at-apply: font-bold px-2;
			}

			&-center {
				--at-apply: font-bold;
			}

			&-right {
				--at-apply: font-bold px-2;
			}
		}

		// 内容区域
		&-contents {
			--at-apply: flex-1 flex h-full;

			overflow: hidden;

			// height: calc(100% -48px);
			&-left {
				--at-apply: flex flex-row h-full;

				&-nav-bar {
					--at-apply: w-full;

					&-tabs {
						// border: 1px solid red;
						/* tabs 样式调整 开始 */

						:deep(.ant-tabs-tab) {
							padding: 8px 12px;
						}

						:deep(.ant-tabs-content-holder) {
							.ant-tabs-content {
								height: 100%;

								.ant-tabs-tabpane {
									padding-left: 0;
									height: 100%;
								}
							}
						}

						/* tabs 样式调整  结束 */

						.tab-wrapper {
							--at-apply: h-full p-2;
						}

						&-components {
							--at-apply: h-full flex flex-col box-border;

							overflow: hidden;

							&-components {
								--at-apply: flex-1 pb-12 flex flex-col;
								overflow: hidden;

								&-searcher {
									--at-apply: py-1 px-2 box-border;
									box-shadow: 0 1px 1px #eaeaea;
								}

								&-lists {
									--at-apply: px-1;

									&-item {
										border: 1px solid #eaeaea;
										--at-apply: p-2 cursor-pointer rd flex
											items-center justify-between;

										&-left {
											--at-apply: flex items-center
												justify-start;

											.icon {
												font-size: 14px;
												--at-apply: mr-1;
											}

											.title {
												font-size: 12px;
												color: rgb(51, 51, 51);
												user-select: none;
											}
										}

										.question-icon {
											--at-apply: hidden;
										}

										&:hover {
											&-right {
												--at-apply: bd-red;
											}

											&-left {
												border: 1px solid red;
											}

											.question-icon {
												display: block;
											}

											border-color: #3e8bf2;
											background-color: #3e8bf20f;

											// background-color: red;

											.icon {
												color: #3e8bf2;
											}

											.title {
												color: #3e8bf2;
											}
										}
									}
								}
							}

							&-outline {
								// border: 1px solid red;
								--at-apply: h-300px;
							}
						}
					}

					// border-right: 1px solid #eaeaea;
				}
			}

			&-canvas {
				--at-apply: "bg-#eeeeee flex-1  flex flex-col w-full h-full box-border";

				overflow: hidden;

				&-tools {
					--at-apply: py-2 px-4 flex justify-between items-center
						box-border;

					.rgi {
						:deep(.ant-radio-button-wrapper) {
							span:last-child {
								--at-apply: flex justify-between items-center
									h-full;
							}
						}
					}

					&-left {
						--at-apply: flex;
					}

					&-center {
						--at-apply: flex items-center justify-center;
						// border: 1px solid red;
					}

					&-right {
						--at-apply: flex;
					}
				}

				&-workspace {
					--at-apply: "flex-1 bg-#fff h-full box-border m-4 rd min-h-0px";
					overflow: hidden;
					// border: 2px solid red;

					&-view {
						--at-apply: h-full box-border;
						overflow: hidden;
						// border: 1px solid #eaeaea;

						&-json {
							border: none;
						}

						&-code {
							border: none;
						}

						&-play {
							--at-apply: box-border;
							overflow: hidden;
						}

						//
					}

					&-view-design {
						--at-apply: h-full box-border;
						overflow: hidden;

						&-form {
							--at-apply: box-border px-3 pt-8;

							div:first-child.no-item {
								// border: 2px solid red;
								height: calc(100% - 65px);

								&::before {
									content: "拖拽组件到这里";
									display: flex;
									justify-content: center;
									align-items: center;
									height: 100%;
									// color: red;
								}
							}
						}
					}
				}
				&-breadcrumbs {
					--at-apply: h-40px min-h-40px flex items-center px-4
						bg-white w-full;

					border-bottom: 1px solid #eaeaea;
				}
			}

			&-right {
				// --at-apply: w-400px flex flex-col h-full;

				--at-apply: w-full flex flex-col h-full;

				&-header {
					--at-apply: h-46px min-h-46px;

					// border: 2px solid red;

					// &-breadcrumb {
					// 	--at-apply: h-40px min-h-40px flex items-center px-2;
					// 	border-bottom: 1px solid #eaeaea;
					// }

					&-tabs-wrapper {
						--at-apply: h-46px min-h-46px;

						:deep(.ant-tabs-nav) {
							margin-bottom: 0;
						}
					}
				}

				&-props-wrapper {
					overflow: hidden;
					--at-apply: flex-1 h-full py-1;
				}
			}
		}
	}
</style>

<style lang="less">
	.Vz-form-designer-components-outline-tree {
		.ant-tree-switcher,
		.ant-tree-switcher_close {
			--at-apply: f-c-c;
		}
	}
</style>
