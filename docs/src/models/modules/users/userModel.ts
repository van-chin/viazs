export interface User {
  id: string;
  name: string;
  status: number;
  description: string;
  remark: string;
  createdAt: MaybeDayjs;
  updatedAt: MaybeDayjs;
  deletedAt?: MaybeDayjs;
}
