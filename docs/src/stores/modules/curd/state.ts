import type { PiniaStateTree, PiniaState } from "@viaz/types";
import type { TooltipProps, FormProps, FormItemProps, PaginationProps } from 'ant-design-vue';

import type { DataTable } from '@/models/modules/oms/datatables/tableModel';

import type { CurdStore } from './index';

interface CurdFormItem {
  // component:Object;
  field: string;
  rule: string;
  children?: CurdFormItem[];
  component?: {
    name: string;
    props: any;
    events?: any;
  };
  grid?: {
    span: number;
    visible: boolean;
  };
  item?: FormItemProps;
}

export interface ImsFormDesignerProps {
  /** 是否展头部 */
  showHeader?: boolean;
  /** 组件配置对象 */
  // formItemProps: ImsFormDesignerConfigurationComponentsProps;
  /** 组件配置对象 */
  componentsProps: ImsFormDesignerConfigurationComponentsProps;
  /** 组件列表 */
  componentLists: ImsFormSchemaItem[];
}

export interface ConfigurationComponent {
  /** 组件名称 */
  name: string;
  /** v-model 字段 */
  vModelField: string;
  /** 组件 props */
  props: Record<string, any>;
  /** 组件事件 */
  events?: ImsFormComponentEvents;
}

/** 配置组件 */
export interface ImsFormDesignerConfigurationComponent {
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
  mode: 'api' | 'custom' | 'context' | 'default';
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
export type ImsFormComponentEvents = Record<string, string[]>;

/**
 * 表单项
 */
export interface ImsFormSchemaItem {
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
    events?: ImsFormComponentEvents;
    /** 组件属性 */
    props: Record<string, any>;
  };
  /** 组件属性(props)配置 */
  componentProps: ImsFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: ImsFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children?: ImsFormSchemaItem[];
}

/**
 * 组件属性配置 Prop Configuration
 */
export type ImsFormDesignerConfigurationComponentsProps = Record<string, ImsFormDesignerConfigurationComponent[]>;

export interface ImsFormSchemaForm {
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
    events?: ImsFormComponentEvents;
    /** 组件属性 */
    props: Record<string, string | number | boolean | Function | string[]>;
  };
  /** 组件属性(props)配置 */
  componentProps: ImsFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: ImsFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children: ImsFormSchemaItem[];
}

export type ImsFormSchemaFormOrItem = ImsFormSchemaForm | ImsFormSchemaItem;

export type ImsFormSchemaModel = Record<string, string | boolean | number | Function | Array<string | number>>;

export type ImsFormSchemaRules = Record<string, []>;

//
/** 表单JSON Schema */
export interface ImsFormSchema {
  /** 数据 model */
  model: ImsFormSchemaModel;
  /** 校验规则 rules */
  rules: ImsFormSchemaRules;
  /** 表单项目配置 */
  items: [ImsFormSchemaForm];
}

interface Apis {
  /**
   * 表格列数据 API
   */
  columns: AnyPromiseFunction | any;
  /**
   * 表格数据 API
   */
  lists: AnyPromiseFunction | any;
  /**
   * CURD 过滤器表单
   */
  filters: AnyPromiseFunction | any;

  /**
   * CURD 搜索器 表单
   */
  searcherSchema: AnyPromiseFunction | any;

  /**
   * CURD 过滤器 表单
   */
  filterSchema: AnyPromiseFunction | any;
  /**
   * CURD CUER 表单
   */
  cuerSchema: AnyPromiseFunction | any;

  /**
   * CURD 创建/编辑表单
   */
  cus: AnyPromiseFunction | any;
  /**
   * CURD 数据更新 接口
   */
  update: AnyPromiseFunction | any;
  /**
   * CURD 数据删除接口
   */
  destroy: AnyPromiseFunction | any;
  /**
   * CURD 数据恢复接口
   */
  recovery: AnyPromiseFunction | any;
  [key: string]: any;
}
// PiniaStateTree StateTree

export interface CurdState extends PiniaStateTree {
  /** CURD 表单配置 */
  cuer: ImsFormSchema;
  searcher: ImsFormSchema;
  filter?: ImsFormSchema;
  /** api 请求接口 */
  apis: Apis;

  currentData: any;

  /**
   * 资源URI
   * 用于请求表单，表头列，列表等数据
   */
  uri: string;
  /**
   * 初始化 状态
   *
   */
  initialing: boolean;

  /**
   * 过滤器/搜索 状态
   */
  filtering: boolean;
  /**
   * 操作确认加载状态
   */
  confirmLoading: boolean;
  /**
   * 数据列表
   */
  lists: any[];

  /**
   * 表格组件 表格列的配置描述 ImsTableColumn[]
   * @access https://www.antdv.com/components/table-cn/#API
   */
  columns: any[];
  /**
   * 数据表格
   */
  dataTable: DataTable;

  /**
   * 数据表格 方案
   */
  schemes: any[];

  /**
   * Pagination 分页的配置描述
   * @access https://www.antdv.com/components/pagination-cn/#API
   */
  paginations?: PaginationProps & {
    current: number;
    total: number;
  };

  /**
   * 过滤器表单配置
   */
  filters: {
    labelCol?: object;
    name?: string;
    model: object;
    // items: IFormItem[];
    spans: number;
    rules?: object;
  };
  filterForm: { [key: string]: any };
  /**
   * Create/Update 表单配置
   */
  cuForm: {
    labelCol?: object;
    name?: string;
    model: object;
    // items: CurdFormItem[];
    items: [];
    rules?: object;
  };
}
// @ts-ignore
export const state: PiniaState<CurdStore> = () => ({
  /** CURD CUER表单 */
  cuer: {
    items: [
      {
        id: 'tHGUhT0q4Ddzuf86gjg21',
        key: 'tHGUhT0q4Ddzuf86gjg21',
        icon: 'iconoir:input-field',
        item: {
          name: 'f_9GqdghhCcT4Dr6VZp-i',
          colon: true,
          layout: 'vertical',

          labelCol: {
            style: {
              width: '100px'
            }
          },
          labelAlign: 'right',
          displayState: true,
          labelShow: false
        },
        type: 'form',
        class: '',
        title: '表单',
        children: [],
        component: {
          name: 'AForm',
          props: {}
        },
        vModelField: 'value',
        formItemProps: [],
        componentProps: []
      }
    ],
    model: {},
    rules: {}
  },
  searcher: {
    items: [
      {
        id: 'tHGUhT0q4Ddzuf86gjg21',
        key: 'tHGUhT0q4Ddzuf86gjg21',
        icon: 'iconoir:input-field',
        item: {
          name: 'f_9GqdghhCcT4Dr6VZp-i',
          colon: true,
          layout: 'vertical',

          labelCol: {
            style: {
              width: '100px'
            }
          },
          labelAlign: 'right',
          displayState: true,
          labelShow: false
        },
        type: 'form',
        class: '',
        title: '表单',
        children: [
          {
            id: 'YvkOyRGyD0BMzdMxG5yIO',
            key: 'YvkOyRGyD0BMzdMxG5yIO',
            title: '选择框',
            icon: 'tabler:select',
            type: 'select',
            vModelField: 'value',
            item: {
              label: '选择框',
              name: 'keywords',
              tooltip: '',
              extra: '',
              required: false,
              colon: true,
              displayState: true,
              rules: [],
              autoLink: false
            },
            component: {
              name: 'AInput',
              class: 'w-full',
              events: {},
              props: {
                bordered: true,
                allowClear: true,
                placeholder: '按 xxx 搜索',
                virtual: true,
                fieldNames: {
                  label: 'label',
                  value: 'value',
                  options: 'options'
                },
                events: {}
              },
              emitsEvents: {}
            },
            componentProps: [],
            formItemProps: [],
            class: 'clone-way-select'
          }
        ],
        component: {
          name: 'AForm',
          props: {}
        },
        vModelField: 'value',
        formItemProps: [],
        componentProps: []
      }
    ],
    model: {},
    rules: {}
  },
  filter: {
    items: [
      {
        id: 'tHGUhT0q4Ddzuf86gjg21',
        key: 'tHGUhT0q4Ddzuf86gjg21',
        icon: 'iconoir:input-field',
        item: {
          name: 'f_9GqdghhCcT4Dr6VZp-i',
          colon: true,
          layout: 'vertical',

          labelCol: {
            style: {
              width: '100px'
            }
          },
          labelAlign: 'right',
          displayState: true,
          labelShow: false
        },
        type: 'form',
        class: '',
        title: '表单',
        children: [],
        component: {
          name: 'AForm',
          props: {}
        },
        vModelField: 'value',
        formItemProps: [],
        componentProps: []
      }
    ],
    model: {},
    rules: {}
  },
  apis: {
    columns: undefined,
    lists: undefined,
    filters: undefined,
    searcherSchema: undefined,
    filterSchema: undefined,
    cuerSchema: undefined,
    cus: undefined,
    update: undefined,
    destroy: undefined,
    recovery: undefined
  },
  currentData: {},
  uri: '',
  initialing: false,
  filtering: false,
  confirmLoading: false,
  lists: [],
  dataTable: {
    id: '',
    name: '',
    code: '',
    tenant_id: '',
    revision: '',
    description: '',
    remark: '',
    created_by: '',
    updated_by: '',
    deleted_by: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    schemes: [],
    columns: []
  },
  columns: [],
  schemes: [],
  // paginations: {
  //   current: 1,
  //   total: 100
  // },
  paginations: {
    current: 1,
    total: 100,
    pageSize: 20
  },
  filters: {
    model: {},
    items: [],
    spans: 4
  },
  filterForm: {},
  cuForm: {
    model: {},
    items: []
  }
});
