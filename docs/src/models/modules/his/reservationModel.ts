export interface Reservation {
  id: string;
  name: string;
  code: string;
  status: number;
  sort: number;
  description: string;
  remark: string;
  createdAt: any;
  updatedAt: any;
  deletedAt?: any;
}
