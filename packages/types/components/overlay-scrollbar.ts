import type { OverlayScrollbarsComponentProps } from "overlayscrollbars-vue";

export interface VzOverlayScrollbarProps {
	/** Os 配置选项 */
	options?:
		| DeepPartial<OverlayScrollbarsComponentProps["options"]>
		| false
		| null;

	/** 加载提示文案 */
	loadingTip?: string;
}
