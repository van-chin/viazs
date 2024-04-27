<template>
	<div :class="prefixCls">
		<div :class="`${prefixCls}-objects`" ref="objectsRef">
			<template v-if="modelValues.length">
				<a-space
					:size="6"
					:class="`${prefixCls}-objects-item`"
					:key="item.id"
					v-for="(item, index) in modelValues"
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
						<a-checkbox v-model:checked="item.status"></a-checkbox>
					</div>
					<div class="">
						<a-input placeholder="key" v-model:value="item.key">
							<template #prefix>
								<span class="text-[#0000004f] text-[10px]"
									>key</span
								>
							</template>
						</a-input>
					</div>
					<div class="">
						<VzConfigurationValue
							:valueTypes
							v-model:value="item.value"
						></VzConfigurationValue>
					</div>

					<Icon
						@click="onDeleteModelValuesItem(index)"
						icon="ant-design:delete-outlined"
						style="font-size: 16px"
						:inline="true"
						class="cursor-pointer text-[#888] hover:text-red"
					></Icon>
				</a-space>
			</template>

			<a-empty v-else description="暂无数据，请添加" />
			<a-button block type="dashed" @click="addModelValuesItem"
				>添加一项</a-button
			>
		</div>
	</div>
</template>
<script lang="ts" setup>
	import { useStyle, useRefs } from "@viaz/hooks";
	import { ref, watch, toRefs, computed } from "vue";

	import { nanoid } from "nanoid";

	import { useDraggable } from "vue-draggable-plus";

	import type { VzConfigurationObjectProps } from "@viaz/types";
	const COMPONENT_NAME = "VzConfigurationObject";
	defineOptions({
		name: COMPONENT_NAME,
	});

	const props = withDefaults(defineProps<VzConfigurationObjectProps>(), {});

	const { prefixCls } = useStyle("configuration-object");

	const modelValue = defineModel<Record<string, any>>("value", {
		default: {},
	});

	const objectsRef = ref<HTMLElement>();

	const modelValues = ref<any[]>([]);

	const { refs, toRef } = useRefs<{
		objects: InstanceType<typeof HTMLElement>;
	}>();

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
		// {
		// 	label: "OBJECT",
		// 	value: "object",
		// 	key: 5,
		// 	title: "对象",
		// },
	];

	const addModelValuesItem = () => {
		let itemId = nanoid();
		modelValues.value.push({
			id: itemId,
			key: `k-${itemId}`,
			value: `v-${itemId}`,
			status: true,
		});
	};

	const onDeleteModelValuesItem = (index: number) => {
		modelValues.value.splice(index, 1);
	};

	(async function init() {
		Object.keys(modelValue.value).forEach((item) => {
			modelValues.value.push({
				id: nanoid(),
				key: item,
				value: modelValue.value[item],
			});
		});

		useDraggable(objectsRef, modelValues, {
			animation: 150,
			handle: ".handler",
			ghostClass: "ghost",
		});

		// console.info('refs =>',refs);
	})();

	watch(
		() => modelValues.value,
		() => {
			let tmpModelValue: Record<string, any> = {};
			modelValues.value.forEach((item) => {
				tmpModelValue[item.key] = item.value;
			});
			modelValue.value = tmpModelValue;
		},
		{
			deep: true,
		}
	);

	// useDraggable(objectsRef, modelValues, {
	// 	animation: 150,
	// 	handle: ".handler",
	// 	ghostClass: "ghost",
	// });
</script>

<style lang="less" scoped>
	@prefix-cls: ~"@{namespace}-configuration-object";

	.@{prefix-cls} {
		--at-apply: w-full;
		&-objects {
			&-item {
				// border: 1px solid red;
				--at-apply: mb-2;
			}
		}
	}
</style>
