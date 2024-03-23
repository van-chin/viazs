export interface DatatableScheme {
  /**
   * 方案名称
   */
  name: string;
  id: string;
  /**
   * 所属数据表格ID
   */
  table_id: string;
  owner_id: string;
  tenant_id: string;

  revision?: string;
  description: string;
  remark: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  /**
   * 所属数据表格
   */
  table?: any;
  /**
   * 方案数列
   */
  columns: any;
}
