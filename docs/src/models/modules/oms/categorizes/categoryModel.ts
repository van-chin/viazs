export interface CategorizeCategory {
  id: string;
  categorizeTypeId: string;
  categorizeTypeIds: string[];
  categorizeTypeNames: string[];
  parentId: string;
  parentIds: Array<string>;
  parentNames: Array<string>;
  name: string;
  alias: null;
  code: string;
  icon?: string;
  extras?: any;
  status: boolean;
  sort: number;
  children?: CategorizeCategory[];
  createdAt: MaybeDayjs;
  updatedAt: MaybeDayjs;
  deletedAt?: MaybeDayjs;
  description: null;
  remark: null;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  /** 过滤器 数据查找条件 */
  filters?: Record<string, any>;
}
