import request from '@/utils/axios/index'
import { Comment, CommentList, CommentParam } from '@/types/comment'
import { Query } from '@/types/common'
import { Res } from '@/types/axios'

// export const getCommentList = async (query?:any) => {
// 	let url: string;
// 		url = `/comment`;
// 	return await request({
// 		url,
//         params:query,
// 		method: 'get',
// 	});
// };

export const getCommentList = async (id: string, query?: Query) => {
	let url: string
	url = `/comment/list/${id}`
	return <Res<CommentList>>await request({
		url,
		params: query,
		method: 'get',
	})
}

export const getComment = async (id: string, query?: Query) => {
	let url: string
	url = `/comment/${id}`
	return <Res<Comment>>await request({
		url,
		params: query,
		method: 'get',
	})
}

export const setComment = async (data: CommentParam) => {
	return <Res<Comment>>await request({
		url: '/comment',
		method: 'post',
		data,
	})
}

export const delComment = async (id: string) => {
	return <Res<Comment>>await request({
		url: `/comment/${id}`,
		method: 'delete',
	})
}
