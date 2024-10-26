<template>
	<div class="h-[800px] w-full bd-red">
		<a-button @click="onConfig">配置 {{ opening }} </a-button>

		<a-drawer
			v-model:open="opening"
			class="custom-class"
			root-class-name="root-class-name"
			:root-style="{ color: 'blue' }"
			title="表单设计器"
			placement="right"
			width="100%"
			:contentWrapperStyle="{ transform: 'translateX(0)' }"
			:bodyStyle="drawerBodyStyle"
		>
			<vz-form-designer
				v-model:value="list"
				:components-props="componentsProps"
				:component-lists="componentLists"
				@save="onSave"
			></vz-form-designer>
		</a-drawer>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { VzFormSchema } from "viaz";
	const testValue = ref(["806594161283998156405"]);

	import componentLists from "./component-lists.json";
	import componentsProps from "./component-props.json";

	const drawerBodyStyle = {
		padding: "0",
	};

	const opening = ref<boolean>(false);

	const onConfig = () => {
		opening.value = true;
	};

	const list = ref<VzFormSchema>({
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
	});

	const onSave = (data: any) => {
		console.info("onSave => data", data);

		console.info("onSave => list", list.value);
	};
</script>
