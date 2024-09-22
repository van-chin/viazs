import type { DefaultOptionType } from "ant-design-vue/es/select"; // 这样引入 还是 慢

export interface VzUploaderUppyProps {
	/** 上传服务接口地址 */
	url?: string;
	opts: DefaultOptionType[];
}
