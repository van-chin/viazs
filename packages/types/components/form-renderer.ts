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
}
