/** 订单数据模型 */
export interface TmsOrder {
    /** ID */
    id: string;  
  
    /** 分类名称 */
    name: string;
    
    /** 分类 */
    categoryId:string;
  
    /** 上级ID */
    parentId?: string,
    /** 所有上级ID */
    parentIds?: string[],
    /** 租户ID */
    tenantId:string;
    /** 分类类型 */
    type: number;
    /** 封面图片 */
    cover: string;
    
    
    /** 状态 */
    status: number;
    /** 描述  */
    description: string;
    /** 备注 */
    remark: string;
    /** 排序值 值越大排序越靠前 */
    sort: number;
  
    /** 创建人 */
    createdBy:string;
  
    /** 删除人 */
    deletedBy: string;
  
    /** 创建时间 */     
    createdAt: MaybeDayjs;
    /** 更新时间 */ 
    updatedAt: MaybeDayjs;
    /** 删除时间 */ 
    deletedAt: MaybeDayjs;
  }
  
  