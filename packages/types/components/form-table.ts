import type { SelectProps as ASelectProps } from "ant-design-vue/es/select";

import type { ColumnType  as TableColumnType } from "ant-design-vue/es/table";

import { ConfigurationComponent } from "./form-designer";

export interface VzFormTableColumn extends TableColumnType {
	/**
	 * 组件
	 */
	component?: ConfigurationComponent;
}

export interface VzFormTableProps {
	/** options 接口函数 */
	api?:
		| Function
		| {
				uri: string;
				params?: object;
				options?: object;
		  };
	/** 接口参数 */
	params?: {
		[key: string]: any;
	};
	options?: ASelectProps["options"];
	/**
	 * 操作栏 配置
	 */
	hab?: boolean | object;

	scroll?: object;

	componentsClone?: boolean;
	/** 是否允许增加 */
	allowAdd?: boolean;
	/** 是否可拖拽 */
	draggable?: boolean;

	/**
	 * 表格列配置
	 */
	columns: VzFormTableColumn[];
	/**
	 * 表格数据
	 */
	dataList?: object[];
	/**
	 * 初始化
	 */
	initial: {
		/** 组件 */
		_components?: {
			[key: string]: object;
		};
		[key: string]: any;
	};
	/** table 的 rowKey */
	rowKey?: string;
}
