<template>
	<VueDraggable
		:class="prefixCls"
		group="components"
		@end="onEnd"
		tag="div"
		v-model="list"
	>
		<div
			v-for="item in modelValue"
			:key="item.id"
			:class="[
				'item',
				{
					active: item.id === activeItem.id,
					filtered: item.type === 'grid-layout-col',
					'py-2': item.type === 'grid-layout-col',
					'mb-24px': item.type === 'grid-layout',
				},
			]"
			@click.stop.prevent="onActiveItem(item)"
		>
			<div
				class="tool-bar"
				:style="{
					display: item.id === activeItem.id ? 'block' : 'none',
				}"
			>
				<div class="flex items-center justify-between w-full">
					<div class="text-#0000004f text-12px">
						{{ item.type }} - {{ item.id }}
					</div>
					<div class="flex items-center">
						<div class="action">
							<icon
								icon="uiw:component"
								class="text-#fff"
								:inline="true"
							></icon>
							<span class="text-#fff ml-1">{{ item.title }}</span>
						</div>
						<div class="action" @click.stop="copyItem(item)">
							<icon icon="ant-design:copy-outlined"></icon>
						</div>
						<div class="action">
							<icon icon="tabler:arrows-move"></icon>
						</div>
						<div class="action" @click.stop="deleteItem(item)">
							<icon icon="wpf:delete"></icon>
						</div>
					</div>
				</div>
			</div>

			<template v-if="item.hasOwnProperty('children')">
				<nested-draggable
					@delete="deleteItem"
					class="children-item"
					:data-id="item.id"
					v-model="(item.children as VzFormSchemaItem[])"
					:disabled="item.type === 'grid-layout'"
					filter=".filtered"
				/>
				<div
					class="add-col-action flex items-center justify-center"
					v-if="item.type === 'grid-layout'"
				>
					<a-space>
						<span class="text-#0000004f text-10px">----</span>
						<span
							class="text-#0000004f text-10px cursor-pointer hover:color-#1890ff"
							@click="onAddCol(item)"
							>添加列</span
						>
						<span class="text-#0000004f text-10px">----</span>
					</a-space>
				</div>
			</template>

			<a-form-item
				v-else
				v-bind="
					item.type === 'vz-form-divider'
						? Object.assign({ label: item.title }, item.item, {
								label: '',
						  })
						: Object.assign({ label: item.title }, item.item)
				"
				:class="[item.class, { hided: !item.item.displayState }]"
			>
				<component
					:is="item.component.name || 'AInput'"
					:class="item.component.class || ''"
					v-bind="item.component.props"
				></component>
			</a-form-item>
		</div>
	</VueDraggable>
</template>
<script setup lang="ts">
	import { useStyle } from "@viaz/hooks";
	import { VueDraggable } from "vue-draggable-plus";
	import { computed } from "vue";
	import { StorageSerializers, useStorage } from "@vueuse/core";
	import type { SortableEvent } from "sortablejs";

	import { VzFormSchemaItem } from "@viaz/types";

	const activeItem = useStorage("active-item", { id: "0" }, undefined, {
		serializer: StorageSerializers.object,
	});

	interface Props {
		modelValue: VzFormSchemaItem[];
	}

	const COMPONENT_NAME = "NestedDraggable";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const { prefixCls } = useStyle("nested-draggable");

	const props = defineProps<Props>();

	const emits = defineEmits<{
		"update:modelValue": [value: VzFormSchemaItem[]];
		delete: [item: any];
		copy: [item: any];
		addCol: [item: any];
	}>();

	// const layoutComponentTypes = ["grid-layout", "card", "grid-layout-"];

	const onEnd = (event: SortableEvent) => {
		console.log(
			"🚀 ~ file: nested-draggable.vue:135 ~ onEnd ~ event:",
			event
		);

		console.log(
			"🚀 ~ file: nested-draggable.vue:135 ~ onEnd ~ event:",
			event.to.dataset
		);
	};

	const list = computed({
		get: () => props.modelValue,
		set: (value) => emits("update:modelValue", value),
	});

	const deleteItem = (item: any) => {
		emits("delete", item);
	};

	const copyItem = (item: any) => {
		emits("copy", item);
	};

	const onAddCol = (item: any) => {
		emits("addCol", item);
	};

	const onActiveItem = (item: any) => {
		console.log("onActiveItem =>", item);
		// console.log("list =>", list.value);

		// const findedItem = find(list.value, (t) => t.id === item.id);

		// console.info("findedItem.component =>", findedItem);

		activeItem.value = item;
	};
</script>
<style scoped lang="less">
	.vz-nested-draggable {
		min-height: 60px;

		padding: 0;
		margin: 0;
	}
	.item {
		/* border: 1px solid red;  mb-24px */

		--at-apply: w-full;

		:deep(.ant-form-item.hided) {
			.ant-form-row {
				.ant-form-item-label {
					// &::after {
					//   content: "hided";
					//   top: -10px;
					//   position: relative;
					//   left: -40px;
					// }
					label {
						color: #0000004f;
						font-style: italic;
						text-decoration: line-through;
					}
				}
			}
			padding: 8px 12px;
		}

		&:hover {
			outline: 1px dashed #1890ff;
		}

		&.active {
			outline: 2px solid #1890ff;
			position: relative;
		}

		.tool-bar {
			position: absolute;
			top: -23px;
			background-color: transparent;
			--at-apply: w-full flex justify-end;
			display: none;
			.action {
				border-radius: 2px;
				font-size: 12px !important;
				display: flex;
				align-items: center;
				padding: 0 3px;
				height: 20px;
				background-color: #1890ff;
				margin-left: 2px;
				color: #fff;
				cursor: pointer;
				&:hover {
					background-color: #40a9ff;
				}
			}
		}
	}
	.children-item {
		--at-apply: flex flex-1 w-full;
		border: 1px #d9d9d9 dashed;
		&:hover {
			outline: 1px dashed #1890ff;
		}
	}

	.Vz-nested-draggable.children-item {
		.item {
			.Vz-nested-draggable.children-item {
				&:has(.item) {
					&::after {
						display: none;
					}
				}
				&::after {
					content: "网络列";
					width: 100%;
					background-color: #f0f0f0;
					--at-apply: flex items-center justify-center text-#0000004f
						text-12px;
				}
			}
		}
	}
</style>
