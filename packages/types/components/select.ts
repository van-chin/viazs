import type { DefaultOptionType } from "ant-design-vue/es/select"; // 这样引入 还是 慢

import { DataApi } from "../shims/networks";


export interface VzSelectProps {
	/** 是否立即发起请求 */
	immediate?: boolean;
	/** api 配置 */
	api?: DataApi;
	/** 接口参数 */
	params?: Record<string, any>;
	// 这里用了 antdv 组件的类型 HMR 就会慢
	options?: DefaultOptionType[];
	// options?: any[];
}
