import { DatatableScheme } from './schemeModel';

/**
 * 数据表格
 */
export interface DataTable {
  id: string;
  name: string;
  code: string;
  tenant_id: string;

  revision: string;
  description: string;
  remark: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;

  /**
   * 数据表格 所有可用的方案
   */
  schemes: DatatableScheme[];
  /**
   * 数据表格 所有可用的数列
   */
  columns: ImsTableColumn[];
}
