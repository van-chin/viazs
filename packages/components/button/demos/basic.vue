<template>
	<a-space>
		<vz-button text="abc" @click="onClick">sssss</vz-button>
		<vz-button text="abc">sssss</vz-button>

		<VzPopconfirmButton text="提交">sss</VzPopconfirmButton>
	</a-space>

	<div @paste="handlePaste" class="bd-red p-2">
		<input type="file" />

		{{ uploadedFiles }}
	</div>

	<VzSectionTitle>测试</VzSectionTitle>
</template>

<script setup lang="ts">
	import { useMessage } from "viaz";

	import { ref } from "vue";

	const uploadedFiles = ref([]);

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		console.info("event =>", event);

		const files = event.clipboardData?.files;

		console.info("files =>", files);

		uploadedFiles.value.push(URL.createObjectURL(files[0]));
	};

	const onClick = () => {
		console.info("vvvvv");
		const { createMessage } = useMessage();

		createMessage.success({
			content: "复制成功",
			duration: 5,
		});
	};
</script>
