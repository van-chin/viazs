export interface ColumnLibrary {
	id: string
	tableId: string
	title: string
	width: number
	resizable: boolean
	maxWidth: number
	minWidth: number
	key: string
	fixed: string
	dataIndex: string
	align: string
	sort: number
	formatType: number
	formater: string
	description: string
	remark: string
	createdAt: string
	updatedAt: string
	deletedAt?: any
	ellipsis?: any
}