import type { TooltipProps, FormProps, FormItemProps } from "ant-design-vue";

export interface VzFormDesignerProps {
  /** 是否展头部 */
  showHeader?: boolean;
  /** 组件配置对象 */
  // formItemProps: VzFormDesignerConfigurationComponentsProps;
  /** 组件配置对象 */
  componentsProps: VzFormDesignerConfigurationComponentsProps;
  /** 组件列表 */
  componentLists: VzFormSchemaItem[];
}

export interface ConfigurationComponent {
  /** 组件名称 */
  name: string;
  /** v-model 字段 */
  vModelField: string;
  /** 组件 props */
  props: Record<string, any>;
  /** 组件事件 */
  events?: VzFormComponentEvents;

  /** 组件类型 */
  type?: string;
}

/** 配置组件 */
export interface VzFormDesignerConfigurationComponent {
  /** ID 标识 */
  id?: string;
  /** @description 标签 */
  // xxxx
  label: string;
  /** 字段 */
  field: string;
  /** 显示切换器 */
  visibilityToggler: boolean;
  /** 显示 */
  visible: boolean;
  /** 应用 */
  apply: boolean;
  /** 配置模式 */
  mode: "api" | "custom" | "context" | "default";
  /** 是否展示配置 */
  show?: boolean;
  /** 提示信息 */
  tooltip?: TooltipProps;
  /** 配置组件属性 */
  component: ConfigurationComponent;
}

/** 操作动作 */
export interface operationalAction {
  /** ID 标识 */
  id: string;
  /** 图标  */
  icon: string;
  /** 值 */
  value: string;
  /** 标签 */
  label: string;
}

/** 组件事件 */
export type VzFormComponentEvents = Record<string, string[]>;

/**
 * 表单项
 */
export interface VzFormSchemaItem {
  /** ID 标识  */
  id: string;
  /** key 标识  作用同 id */
  key: string;
  /** 组件标题 */
  title: string;
  /** 组件图标 */
  icon: string;
  /** 组件类型 */
  type: string;
  /** 表单数据字符 model field */
  vModelField: string;
  /** 表单项（FormItem）配置项  */
  item: FormItemProps & {
    /** 展示状态 */
    displayState: true;
    /** 名称 (model名称) */
    name: string;
  };
  /**组件相关配置 */
  component: {
    /** 组件名称  会调整为 name */
    name: string;
    /** 组件事件 */
    events?: VzFormComponentEvents;
    /** 组件属性 */
    props: Record<string, any>;
  };
  /** 组件属性(props)配置 */
  componentProps: VzFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: VzFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children?: VzFormSchemaItem[];
}

/**
 * 组件属性配置 Prop Configuration
 */
export type VzFormDesignerConfigurationComponentsProps = Record<
  string,
  VzFormDesignerConfigurationComponent[]
>;

export interface VzFormSchemaForm {
  /** ID 标识  */
  id: string;
  /** key 标识  作用同 id */
  key: string;
  /** 组件标题 */
  title: string;
  /** 组件图标 */
  icon: string;
  /** 组件类型 */
  type: string;
  /** 表单数据字符 model field */
  vModelField: string;
  /** 表单项（FormItem）配置项  */
  item: FormProps & {
    /** model key */
    name: string;
    /** 展示状态 */
    displayState: true;
    /** 表单标签 是否展示 */
    labelShow: boolean;
    /** label 标签布局 */
    labelCol: {
      /** 标签样式 */
      style: {
        /** 标签宽度 */
        width: string | number;
      };
    };
  };
  /**组件相关配置 */
  component: {
    /** 组件名称 */
    name: string;
    /** 组件类型 class 属性 */
    class?: string;
    /** 组件事件 */
    events?: VzFormComponentEvents;
    /** 组件属性 */
    props: Record<string, string | number | boolean | Function | string[]>;
  };
  /** 组件属性(props)配置 */
  componentProps: VzFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: VzFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children: VzFormSchemaItem[];
}

export type VzFormSchemaFormOrItem = VzFormSchemaForm | VzFormSchemaItem;

export type VzFormSchemaModel = Record<
  string,
  string | boolean | number | Function | Array<string | number>
>;

export type VzFormSchemaRules = Record<string, []>;

//
/** 表单JSON Schema */
export interface VzFormSchema {
  /** 数据 model */
  model: VzFormSchemaModel;
  /** 校验规则 rules */
  rules: VzFormSchemaRules;
  /** 表单项目配置 */
  items: [VzFormSchemaForm];
}
