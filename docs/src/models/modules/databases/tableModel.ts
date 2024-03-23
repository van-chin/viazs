export interface DatabaseTableColumn {
  /**
   * 表名
   */
  name: string;

  /**
   * 职务类型
   */
  type: string;
  /**
   * 职务的图标 默认值为 ant-design:appstore-outlined
   */
  default: string | number | null;

  /**
   * 是否为空
   */
  notnull: boolean;
  /**
   * 长度
   */
  length: number | null;
  /**
   * 精度
   */
  precision: number;
  /**
   * 备注
   */
  comment: string | null;
  /**
   * 是否自动增长
   */
  autoincrement: boolean;
  /**
   * 无符号
   */
  unsigned: boolean;
  /**
   * 删除时间
   */
  fixed: boolean;
  scale: number;
}

export interface DatabaseTable {
  /**
   * 表名
   */
  TABLE_NAME: string;
  TABLE_TYPE: string;
  ENGINE: string;
  VERSION: number;
  ROW_FORMAT: string;
  TABLE_ROWS: number;
  AVG_ROW_LENGTH: number;
  DATA_LENGTH: number;
  MAX_DATA_LENGTH: number;
  AUTO_INCREMENT: number;
  TABLE_COLLATION: string;
  CREATE_OPTIONS: string;
  CREATE_TIME: string;
  UPDATE_TIME: string;
  CHECK_TIME: string;
  TABLE_COMMENT: string;
  INDEX_LENGTH: number;
  DATA_FREE: number;
}
