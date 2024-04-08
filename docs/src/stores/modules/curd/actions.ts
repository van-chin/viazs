import type { PiniaActionTree, PiniaActions } from "@viaz/types";
import type { CurdStore } from './index';
import { sumBy } from 'lodash-es';
import { useMessage } from 'viaz';
import { Form } from 'ant-design-vue';

const { createMessage } = useMessage();

export interface CurdActions extends PiniaActionTree {
  getLists(params: { [key: string]: any }): void;
  getColumns(params: object): void;
  getFilterForm(params: object): void;

  getSearcherSchema(params: object): void;

  getFilterSchema(params: object): void;
  /** 
   * 获取表单 Schema 
   * @param params  参数 {}
   * @param type 类型 `cuer` 编辑 | `filter` 过滤器 | `searcher` 搜索器
  */
  getFormSchema(params: object,type: string): void;

  

  destroy(params: object): void;
  recovery(params: object): void;

  update(params: object): boolean;

  initializeCurd(): void;

  calcFilterFormSpan(filters: { labelCol?: object; name?: string; model: object; items: IFormItem[]; spans?: number; rules?: object }): void;
}

export const actions: PiniaActions<CurdStore> = {
  async getCuForm(params: object) {
    console.info('getCuForm =>.params =>', params);
    const cuForms = await this.apis.cus(params);
    this.cuForm = cuForms;
  },
  async getLists(params) {
    this.filtering = true;
    // const res = await this.apis.lists(params);
    const res = await this.apis.lists(Object.assign(this.filterForm.modelRef || {}, params));
    this.filtering = false;
    const { data, meta } = res;
    this.lists = data;

    console.info('res =>', res);

    if (meta) {
      this.paginations.current = meta.current_page;
      this.paginations.total = meta.total;
      this.paginations.pageSize = meta.total === meta.per_page ? meta.total : meta.per_page;
      // this.paginations = {
      //   // pageSizeOptions: ['10', '15', '20', '30', '40', '50', '100', '200'],
      //   current: meta.current_page,
      //   total: meta.total,
      //   pageSize: meta.total === meta.per_page ? meta.total : meta.per_page
      // };
    }
    // return data;
  },
  async getColumns(params: object) {
    this.initialing = true;

    const dataTable = await this.apis.columns(params);

    const { schemes } = dataTable;

    this.schemes = schemes;

    this.columns = schemes[0].columns;
    this.dataTable = dataTable;
  },
  async getFilterForm(params) {
    console.info('getFilterForm 11');
    const filters = await this.apis.filters(params);
    await this.calcFilterFormSpan(filters);
    this.initialing = false;
  },

  async update(params) {
    const { message, data, code } = await this.apis.update(params);
    const { createMessage } = useMessage();
    if (code === 0) {
      this.getLists(this.filterForm.modelRef);
    }

    createMessage.success(message);
    return code === 0;
  },
  async destroy(params: object) {
    const { code, message } = await this.apis.destroy(params);
    if (code === 0) {
      this.getLists({ is_show_tree: 1, page: 1 });

      createMessage.success(message);
    } else {
      createMessage.warning(message);
    }
  },
  async recovery(params: object) {
    const { code, message } = await this.apis.recovery(params);
    if (code === 0) {
      this.getLists({ is_show_tree: 1, page: 1 });

      createMessage.success(message);
    } else {
      createMessage.warning(message);
    }
  },
  calcFilterFormSpan(filters) {
    const totalSpan = sumBy(filters.items, (item) => item.grid?.span);
    filters.spans = totalSpan;
    this.filters = filters;
    const useForm = Form.useForm;
    this.filterForm = useForm(this.filters.model, this.filters.rules);
  },
  async getSearcherSchema(params: object = {}) {
    console.info('getSearcherSchema 11');
    const searcher = await this.apis.searcherSchema(params);
    console.info('searcher =>', searcher);

    this.searcher = searcher;
  },

  async getFilterSchema(params: object = {}) {
    const filter = await this.apis.filterSchema(params);

    this.filter = filter;
  },
  async getCuerSchema(params: object = {}) {
    const cuer = await this.apis.cuerSchema(params);
    this.cuer = cuer;
  },
  /**
   * 获取表单 Schema 数据
   * @param params 参数
   */
  async getFormSchema(params: object, type: string = "cuer") {

    switch (type) {
      case "cuer":
        await this.getCuerSchema(params);
        break;

      case "filter":
        await this.getFilterSchema(params);
        break;

      case "searcher":
        await this.getSearcherSchema(params);
        break;
    }
    console.info('getFormSchema type ============================== =>', type);
  },
  async initializeCurd() {
    // 获取表格列

    await this.getColumns({ scheme: 1, abc: 'abc' });
    // 获取过滤器相关配置
    await this.getFilterForm({});

    await this.getSearcherSchema({});

    await this.getFilterSchema({});
    // 获取 CUER 表单
    // await this.getCuerSchema({ id: '0' });

    // console.info('initializeCurd.this.filters =>',this.filters);
    await this.getLists(this.filters.model);
  }
};
