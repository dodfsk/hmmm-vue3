import { Comment } from '@/types/comment'
import { User } from '@/types/user'

export type PreSignInfo = {
	url: string
	fileName: string
}
export type RoomStats = {
	likes: number
	views: number
	floors: number
	stars: number
}
export type RoomList={
    total:number,
    roomList:Room[]
}

export type Room = {
	_id: string
	hid: string
	title: string
	content: string | Delta
	desc?: string
	cover?: string
	from: User
	assets?: Array<PreSignInfo> //考虑拆分成单独的assets表,通过hid字段绑定关系,计划任务定期查=>附加表是否有绑定,无绑定做删除事件
	stats: RoomStats
	status: number
	createdAt: Date
	updatedAt?: Date
	// comment?: Array<Comment>
}

export type RoomParam = Partial<Room> 

// type Assets={
//     _id: string
// 	oid: string
//     url:string
//     fileName:string
//     from:User
// }