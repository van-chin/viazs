export interface Visit {
  id: string;
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
