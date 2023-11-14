import { User } from '@/types/user'
import { PreSignInfo } from '@/types/room'

export type CommentList={
    total:number,
    commentList:Comment[]
}

export type Comment = {
	_id?: string
	oid?: string
	content?: string
	floor?: number
	from?: User
    replyTo?:Comment & string
	stats?: CommentStats
	assets?: Array<PreSignInfo>
	createdAt?: Date
	updatedAt?: Date
}

// export type Reply = {
// 	from?: User
// 	content?: string
// 	replyTo?: string
// 	createdAt?: Date
// 	updatedAt?: Date
// }

export type CommentStats = {
	like: number
	reply: number
}
