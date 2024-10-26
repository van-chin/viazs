// /** 表单验证规则 */
// export interface DataFormRule {
//   [key: string]: [];
// }

// "id": "tHGUhT0q4Ddzuf86gjg21",
// "item": {},
// "type": "form",
// "title": "表单",
// "children": [],
// "component": {},
// "formItemProps": []

/** 表单项配置属性 */
export interface FormItemProp {
  field: string;
  label: string;
  props: object;
  component: string;
  vModelField: string;
}

/** 表单配置 SCHEMA */
export interface FormSchema {
  items: [
    {
      /** 表单ID */
      id: string;
      item: object;
      type: string;
      title: string;
      children: [];
      component: object;
      /** 表单项目-配置 */
      formItemProps: FormItemProp[];
    }
  ];
  /**
   * 表单数据模型
   */
  model: {
    [key: string]: string;
  };
  /** 验证规则 */
  rules: {
    [key: string]: [];
  };
}

/**
 * 表单
 */
export interface DataForm {
  /** ID */
  id: string;
  /** 名称  */
  name: string;
  /** 标识 */
  code: string;
  /** 租户 */
  tenant_id?: string;
  /** 表单配置 */
  schema: FormSchema;

  /** 描述 */
  description: string;
  /** 备注 */
  remark: string;
  /** 状态 */
  status: boolean | number;
  /** 排序 */
  sort: number;

  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;

  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
}
