export interface VzTagifyProps {
  /** 标签数据 */
  tags: VzTag[];
}

export interface VzTag {
  /** ID 唯一标识 */
  id: string | number;
  /** 图标 */
  name: string;
  /** ID 唯一标识 */
  value: string | number;
  /** 图标 */
  icon?: string;
  /** 颜色 */
  color?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}
