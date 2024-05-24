<template>
	<div :class="prefixCls">
		<a-form
			:ref="toRef('formRef')"
			v-bind="data.items[0].item"
			v-if="formInstance"
		>
			<template v-for="(item, index) in data.items[0].children">
				<template v-if="item.type === 'grid-layout'">
					<a-row :gutter="6">
						<a-col
							:key="index"
							v-for="(rowItem, index) in item.children"
							:span="
								rowItem.component.props.span
									? rowItem.component.props.span
									: 24 / item.children.length
							"
						>
							<template v-for="ric in rowItem.children">
								<a-form-item
									v-if="ric.item.displayState === true"
									v-bind="
										ric.type === 'ims-form-divider'
											? Object.assign(
													ric.item,
													formInstance.validateInfos[
														ric.item.name
													],
													{ label: '' }
											  )
											: Object.assign(
													ric.item,
													formInstance.validateInfos[
														ric.item.name
													]
											  )
									"
									:label="
										data.items[0].item.labelShow
											? ric.item.label
											: ''
									"
								>
									<tetemplate
										v-if="
											Object.hasOwnProperty.call(
												$slots,
												ric.item.slot
											)
										"
									>
										<slot
											:name="ric.item.slot"
											:item="ric"
											:model="data.model"
										></slot>
									</tetemplate>
									<component
										v-else
										:class="ric.component.class"
										:is="ric.component.name || 'AInput'"
										v-bind="ric.component.props"
										v-on="ric.component?.emitsEvents || {}"
										v-model:[ric.vModelField]="
											data.model[ric.item.name]
										"
									></component>
								</a-form-item>
							</template>
						</a-col>
					</a-row>
				</template>

				<template v-else>
					<a-form-item
						v-if="item.item.displayState === true"
						v-bind="
							item.type === 'ims-form-divider'
								? Object.assign(
										item.item,
										formInstance.validateInfos[
											item.item.name
										],
										{ label: '' }
								  )
								: Object.assign(
										item.item,
										formInstance.validateInfos[
											item.item.name
										]
								  )
						"
						:label="
							data.items[0].item.labelShow ? item.item.label : ''
						"
					>
						<tetemplate
							v-if="item.component.name === 'VzFormTable'"
						>
							<tetemplate
								v-if="
									Object.hasOwnProperty.call(
										$slots,
										item.item.slot
									)
								"
							>
								<slot
									:name="item.item.slot"
									:item="item"
									:model="data.model"
								></slot>
							</tetemplate>
							<component
								v-else
								:is="item.component.name || 'AInput'"
								:class="item.component.class"
								v-bind="item.component.props"
								v-on="item.component?.emitsEvents || {}"
								@field-events="(params: any) => onFieldEvents(item.item.name, params)"
								v-model:[item.vModelField]="
									data.model[item.item.name]
								"
							></component>
						</tetemplate>

						<tetemplate v-else>
							<tetemplate
								v-if="
									Object.hasOwnProperty.call(
										$slots,
										item.item.slot
									)
								"
							>
								<slot
									:name="item.item.slot"
									:item="item"
									:model="data.model"
								></slot>
							</tetemplate>
							<component
								v-else
								:is="item.component.name || 'AInput'"
								:class="item.component.class"
								v-bind="item.component.props"
								v-on="item.component?.emitsEvents || {}"
								v-model:[item.vModelField]="
									data.model[item.item.name]
								"
							></component>
						</tetemplate>
					</a-form-item>
				</template>
			</template>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
	import type {
		VzFormRendererProps,
		UseFormType,
		VzFormExpose,
		VzFormSchemaItem,
	} from "@viaz/types";
	import { useStyle, useRefs } from "@viaz/hooks";
	import { Form } from "ant-design-vue";
	import { getCurrentInstance } from "vue";

	import { foreach } from "tree-lodash";

	import { update } from "lodash-es";

	//treeFindPath
	import { treeFindNode } from "@utopia-utils/core";

	import { ref, watch, toRefs, reactive, useSlots } from "vue";

	const COMPONENT_NAME = "VzFormRenderer";
	defineOptions({
		name: COMPONENT_NAME,
	});
	const { prefixCls } = useStyle("form-renderer");

	const props = withDefaults(defineProps<VzFormRendererProps>(), {});
	const useForm = Form.useForm;

	const formInstance = ref<UseFormType>();

	const slots = useSlots();

	const slotKeys = Object.keys(slots);

	const { refs, toRef } = useRefs<{
		formRef: InstanceType<typeof HTMLElement>;
	}>();


	const currentInstance = getCurrentInstance();

	const emits = defineEmits<{
		validateChange: [
			name: string | number | string[] | number[],
			status: boolean,
			errors: string[] | null
		];
	}>();

	const emitEventHandler = (field: string, event: string, params: any) => {
		const eo = `${field}-${event}`;
		currentInstance.emitsOptions[eo] = null;
		console.log("🚀 ~ file: index.vue:207 ~ emitEventHandler ~ eo:", eo);
		console.log(
			"🚀 ~ file: index.vue:207 ~ emitEventHandler ~ params:",
			params
		);
		emits(eo, params);
	};

	const onFieldEvents = (field: string, params: any) => {
		console.log(
			"🚀 ~ file: index.vue:212 ~ onFieldEvents ~ params:",
			params
		);
		const { columnField, event } = params;
		const eo = `${field}-${columnField}-${event}`;
		emits(eo, params.params);
	};

	const { data } = toRefs(props);

	// 处理表单事件 emitsEvents

	const parseEvents = () => {
		foreach(props.data.items[0].children, (item) => {
			if (item.component && item.component.events) {
				let emitsEvents = {};
				for (const key in item.component.events) {
					emitsEvents[key] = (...args: any) => {
						let params = reactive({});
						item.component.events[key].map(
							(pkey: string, index: number) => {
								params[pkey] = args[index];
							}
						);
						emitEventHandler(item.item.name, key, params);
					};
				}
				item.component.emitsEvents = emitsEvents;
			}
		});
	};

	const reset = () => {
		formInstance.value?.clearValidate();
		formInstance.value?.resetFields();
	};

	(async function init() {
		parseEvents();
		formInstance.value = useForm(props.data.model, props.data.rules, {
			onValidate: (name, status, errors) => {
				emits("validateChange", name, status, errors);
			},
		});
	})();

	/**
	 * 查找表单组件节点
	 *
	 * @param componentItemName model key 模型字段
	 *
	 * @returns { VzFormSchemaItem | false } 查找到的节点，未找到返回 false
	 */
	const findComponentNode = (
		componentItemName: string
	): VzFormSchemaItem | false => {
		const findedNode: VzFormSchemaItem = treeFindNode(
			props.data.items[0].children,
			(item: VzFormSchemaItem) => item.item.name === componentItemName
		)[0];
		console.info("findedNode =>", findedNode);

		if (findedNode) {
			return findedNode;
		} else {
			console.warn(
				`没有找到指定 ${componentItemName} 组件节点,请检查...`
			);
			return false;
		}
	};

	/**
	 * 更新表单组件节点
	 * @param {string} componentItemName 组件 item.name
	 * @param { string|[] } path 路径
	 * @param {any} value 更新的值 参数 value
	 */
	const updateComponentProp = (
		componentItemName: string,
		path: string | [],
		value: any
	) => {
		const findedNode = findComponentNode(componentItemName);
		if (findedNode !== false) {
			update(findedNode, path, () => value);
		}
	};

	/**
	 * 更新表单model 数
	 * @param {string} fields 组件 item.name
	 * @param {any} value 更新的值 参数 value
	 * @param {string | []} path 针对要修改的 类型是 数组或对象
	 */
	const updateFormModel = (
		fields: string,
		value: any,
		path?: string | []
	) => {
		console.info("updateFormModel => fields", fields);
		console.info("updateFormModel => value", value);

		console.info("formInstance modelRef =>", formInstance.value.modelRef);

		if (path !== undefined) {
			/**
			 * TODO
			 * 需要增加对 对象 和 数组类型的字段进行修改
			 */

			console.info(
				`修改对象或数组 formInstance.value.modelRef[${fields}] =>`,
				formInstance.value.modelRef[fields]
			);
			console.info("updateFormModel => path", path);
			update(formInstance.value.modelRef[fields], path, () => value);
		} else {
			formInstance.value.modelRef[fields] = value;
		}

		// const findedNode = findComponentNode(componentItemName);
		// if (findedNode !== false) {
		//   update(findedNode, path, () => value);
		// }
	};

	defineExpose<VzFormExpose>({
		refs: refs,
		formInstance: formInstance.value,
		reset: reset,
		findComponentNode: findComponentNode,
		updateComponentProp: updateComponentProp,
		updateFormModel: updateFormModel,
	} as VzFormExpose);

	watch(data, (newVal) => {
		parseEvents();
		formInstance.value = useForm(newVal.model, newVal.rules, {
			onValidate: (name, status, errors) => {
				emits("validateChange", name, status, errors);
			},
		});
	});
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-form-renderer";

	.@{prefix-cls} {
		--at-apply: w-full;
	}
</style>
