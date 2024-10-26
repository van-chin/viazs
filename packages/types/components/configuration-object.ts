/** 组件事件 */
interface ValueType {
	label: string;
	value: string;
	key: string;
	title: string;
}

export interface VzConfigurationObjectProps {
	valueTypes: ValueType[];
}
