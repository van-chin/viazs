import { Model } from 'pinia-orm';
import { Str, Uid, Num } from 'pinia-orm/decorators';

import { DateCast } from 'pinia-orm/casts';
export default class User extends Model {
  // entity is a required property for all models.
  static entity = 'mers_merchants';

  @Uid() declare id: string;
  @Str('') declare name: string;
  @Str('') declare code: string;

  @Num('') declare status: number;
  @Num('') declare sort: number;
  @Str('') declare description: string;
  @Str('') declare remark: string;

  @Str('') declare createdAt: MaybeDayjs;
  @Str('') declare updatedAt: MaybeDayjs;
  @Str('') declare deletedAt?: MaybeDayjs;

  static casts() {
    return {
      createdAt: DateCast,
      updatedAt: DateCast,
      deletedAt: DateCast
    };
  }
}

export interface Merchant {
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
