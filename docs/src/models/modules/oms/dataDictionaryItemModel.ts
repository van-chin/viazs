export interface DataDictionary {
  id: string;
  dataDictionaryId: string;
  tenantId: string;
  name: string;
  code: string;
  status: number;
  sort: number;
  description: string;
  remark: string;
  createdAt: MaybeDayjs;
  updatedAt: MaybeDayjs;
  deletedAt?: MaybeDayjs;
}
