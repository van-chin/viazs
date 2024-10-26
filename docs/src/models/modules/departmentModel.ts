export interface Department {
  /**
   * ID
   */
  id: string;
  /**
   * 上级ID
   */
  parent_id: string;
  parent_ids: string[];
  parent_names: string[];
  /**
   * 名称
   */
  name: string;
  /**
   * 别名
   */
  alias: string;
  /**
   * 组织类型
   */
  type: number;
  /**
   * 角色的图标 默认值为 ant-design:appstore-outlined
   */
  icon?: string;

  /**
   * 角色的排序值
   */
  sort: number;
  /**
   * 角色的状态
   */
  status: number;
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
  /**
   * 描述
   */
  description: string;
  /**
   * 备注
   */
  remark: string;
}
