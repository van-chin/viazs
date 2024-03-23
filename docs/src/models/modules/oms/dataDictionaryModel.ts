export interface DataDictionary {
  id: string;
  code: string;
  tenantId: string;
  parentId: string;
  parentIds: string[];
  parentNames: string[];
  name: string;
  type: number;
  status: number;
  sort: number;
  description: string;
  remark: string;
  createdAt: MaybeDayjs;
  updatedAt: MaybeDayjs;
  deletedAt?: MaybeDayjs;
}
