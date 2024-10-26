export interface CategorizeType {
  /** 类型唯一标识 */
  id: string;
  /** 上级ID */
  parentId: string;
  /** 上级ID 路径 */
  parentIds: Array<string>;
  /** 上级名称 路径 */
  parentNames: Array<string>;
  /** 类型的名称 */
  name: string;
  /** 类型的别称 */
  alias: null;
  /** 标识 */
  code: string;
  icon?: string;
  extras?: any;
  /** 状态 */
  status: boolean;
  /** 排序值 */
  sort: number;
  /** 子数据 */
  children?:CategorizeType[];
  createdAt: MaybeDayjs;
  updatedAt: MaybeDayjs;
  deletedAt?: MaybeDayjs;
  /** 描述 */
  description: string;
  /** 备注 */
  remark: string;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
}

