export interface TmsTag {
	id: string
	parentId: string
	type: number
	name: string
	sort: number
	status: boolean
	color?: string
	createdAt: MaybeDayjs
	updatedAt: MaybeDayjs
	deletedAt?: MaybeDayjs
}