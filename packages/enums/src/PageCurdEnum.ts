/**
 * curd emit 事件类型
 * MERGE | OVERLAY | OVERLAY_MERGE
 */
export enum PageCurdActionEmitEnum {
  // 创建
  CREATE = "curd-create",
  IMPORT = "curd-import",
  EDIT = "curd-edit",
  UPDATE = "curd-update",
  QUERY = "curd-query",
  SEARCH = "curd-search",
  DETAIL = "curd-detail",
  LISTS = "curd-lists",
  EXPORT = "curd-export",
  DELETE = "curd-delete",
  DESTROY = "curd-destroy",
  RECOVERY = "curd-recovery",
  BATCH_DESTROY = "curd-batch-destroy",
  BATCH_RECOVERY = "curd-batch-recovery",
}

/**
 * curd emit 位置
 * MERGE | OVERLAY | OVERLAY_MERGE
 */
export enum PageCurdActionPositionEnum {
  // 创建
  FILTER_ACTION_BAR_LEFT = "fl",
  FILTER_ACTION_BAR_RIGHT = "fr",
  TABLE_ROW_OPERATIONS = "ro",
}

/**
 * PageCurd 模式
 */
export enum PageCurdModeEnum {
  // 增加/创建
  CREATE = 1,
  // 编辑/修改
  EDIT = 2,
  // 查看
  DETAIL = 3,
  // 授权
  AUTHORIZATION = 4,
}
