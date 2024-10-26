export interface TeasStore {
    /** ID */
    id: string;  

    /** 门店名称 */
    name: string;
    /** 门店别名 */
    alias: string;
    /** 上级ID */
    parentId?: string,
    /** 所有上级ID */
    parentIds?: string[],
    /** 租户ID */
    tenantId:string;
    /** 门店 运营类型 */
    type: number;
    /** 门店封面图片 */
    cover: string;
    /** 开店时间 */
    openedAt: MaybeDayjs;
    /** 营业开始时间 */
    businessStartAt: MaybeDayjs;
    /** 营业结束时间 */
    businessEndAt: MaybeDayjs;

    businessHours: string[];

    /** 门店详细地址 */
    address:string;
    /** 门店定位经度 */
    longitude:string;
    /** 门店定位纬度 */
    latitude:string;
    
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
    /** 更新人 */
    updatedBy: string;
    /** 删除人 */
    deletedBy: string;

    /** 创建时间 */     
    createdAt: MaybeDayjs;
    /** 更新时间 */ 
    updatedAt: MaybeDayjs;
    /** 删除时间 */ 
    deletedAt: MaybeDayjs;
  }
  