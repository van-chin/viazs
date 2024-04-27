/** 值类型 */
export interface ConfigurationValueType {
	/** 标签 */
	label: string;
	/** 值 */
	value: string;
	/** KEY */
	key: string | number;
	/** 标题 */
	title: string;
}

/** 可配置值类型 */
export type ConfigurableValue = string | boolean | object | [];

export interface VzConfigurationValueProps {
	/** 值类型 */
	valueTypes?: Array<ConfigurationValueType>;
	/** type 组件类型 */
	type?: string;
	/** field 配置字段 */
	field?: string;
}
