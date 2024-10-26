export interface NodeItem {
  /**
   * 节点ID
   */
  id: number;
  /**
   * 节点的上级ID
   */
  pid: number;
  /**
   * 节点ID路径
   */
  pids: number[];
  /**
   * 节点名称路径
   */
  pnames: string[];
  /**
   * 节点的类型
   */
  type: number;
  /**
   * 节点的图标 默认值为 ant-design:appstore-outlined
   */
  icon: string;
  /**
   * 节点的名称
   */
  name: string;
  /**
   * Node 节点的唯一标识
   */
  code: string;
  options?: object;
  /**
   * 节点的排序值
   */
  sort: number;
  /**
   * 节点的状态
   */
  status: number;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  visible: number;

  description: string;
  remark: string;
  children?: NodeItem[];
  /**
   * 节点的下级数/量
   */
  inferiors_count?: number;
}
