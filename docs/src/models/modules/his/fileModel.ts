export interface ExplorerFile {
  /**
   * 文件 ID
   */
  id: string;
  /**
   * 关联 ID
   */
  relatedId: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 文件 URL
   */
  url: string;
  /**
   * 文件其他属性
   */
  options: Object;
  /**
   * 文件名称
   */
  name: string;
  /**
   * 分类 ID
   */
  categoryId: string;
  /**
   * 文件大小
   */
  size: string;
  /**
   * 文件后缀
   */
  extension: string;
  /**
   * 文件封面图片
   */
  cover: string;
  /**
   * 文件状态
   */
  status?: number;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 描述
   */
  description?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 创建时间
   */
  createdAt: any;
  /**
   * 更新时间
   */
  updatedAt: any;
  /**
   * 删除时间
   */
  deletedAt?: any;
}
