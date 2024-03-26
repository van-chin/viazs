export interface VzCheckboxGroupOption {
    label: string;
    value: string | number;
    disabled?: boolean;
    indeterminate?: boolean;
}




export interface VzCheckboxGroupProps {
    /** 数据选项 */
    options: VzCheckboxGroupOption[],
    /** 可被勾选的 checkbox 的最小数量 */
    min?: number;
    /** 可被勾选的 checkbox 的最大数量 */
    max?: number;
}