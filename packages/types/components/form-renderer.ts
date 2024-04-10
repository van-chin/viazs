// import type { FormItemProps } from "ant-design-vue";

export interface VzFormRendererProps {
  /** 表单数据 */
  data: any;
  validateInfos?: object;
  eoPrefix?: string;
}

import { Form } from "ant-design-vue";

export type UseFormType = ReturnType<typeof Form.useForm>;

export interface VzFormExpose {
  /** 表单实例 */
  formInstance: UseFormType;
  // 重置表单方法
  reset: Function;

  /**
 * 查找表单组件节点
 * 
 * @param componentItemName model key 模型字段
 * 
 * @returns { VzFormSchemaItem | false } 查找到的节点，未找到返回 false
 */
  findComponentNode: Function;
  /**
   * 更新组件节点属性
   */
  updateComponentProp: Function;
  /** 更新表单模型 */
  updateFormModel: Function;
}
