import { NodeItem } from './nodeModel';

export interface RoleItem {
  /**
   * 角色ID
   */
  id: number;
  /**
   * 角色的名称
   */
  name: string;
  /**
   * 角色组ID
   */
  gid?: number;
  /**
   * 角色的图标 默认值为 ant-design:appstore-outlined
   */
  icon?: string;
  /**
   * Role 角色的唯一标识
   */
  code: string;
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
  created_at: Date;
  /**
   * 更新时间
   */
  updated_at: Date;
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
  /**
   * 关联的节点
   */
  nodes: NodeItem[];
  /**
   * 关联的节点树
   */
  tree_nodes?: NodeItem[];
}
