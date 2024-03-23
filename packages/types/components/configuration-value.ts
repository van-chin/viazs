/** 值类型 */
export interface ConfigurationValueType {
  label: string;
  value: string;
  key: string | number;
  title: string;
}

/** 可配置值类型 */
export type ConfigurableValue = string | boolean | object | [];

export interface VzConfigurationValueProps {
  /** 值类型 */
  valueTypes?: ConfigurationValueType[];
  /** type 组件类型 */
  type?: string;
  /** field 配置字段 */
  field?: string;
}
