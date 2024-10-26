import type { FormItemProps } from "ant-design-vue/es/form";

export interface IFormItem {
  // component:Object;
  field: string;
  rule: string;
  children?: IFormItem[];
  component?: {
    name: string;
    props: any;
    events?: any;
    [key: string]: any;
  };
  grid?: {
    span: number;
    visible: boolean;
  };
  item?: FormItemProps;
}

export interface VzFormItemProps {
  item: IFormItem;
  model: object;
  validateInfos: object;
  layout: string;
  rules?: object;
  eoPrefix?: string;
}

export interface VzFormProps {
  items: IFormItem[] | object;
  validateInfos?: object;

  eoPrefix?: string;
}
