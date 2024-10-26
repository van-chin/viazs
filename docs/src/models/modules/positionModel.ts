export interface PositionItem {
  /**
   * ID
   */
  id: string;

  /**
   * 职务名称
   */
  name: string;

  /**
   * 职务类型
   */
  type?: number;
  /**
   * 职务的图标 默认值为 ant-design:appstore-outlined
   */
  icon?: string;

  /**
   * 职务的排序值
   */
  sort: number;
  /**
   * 职务的状态
   */
  status: number;
  /**
   * 描述
   */
  description: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 创建时间
   */
  created_at: Date | null;
  /**
   * 更新时间
   */
  updated_at: Date | null;
  /**
   * 删除时间
   */
  deleted_at: Date | null;
}
