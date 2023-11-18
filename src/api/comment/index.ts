import request from '@/utils/axios/index'
import { Comment, CommentParam } from '@/types/comment'
import { Query } from '@/types/common'

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
	return await request({
		url,
		params: query,
		method: 'get',
	})
}

export const getComment = async (id: string, query?: Query) => {
	let url: string
	url = `/comment/${id}`
	return await request({
		url,
		params: query,
		method: 'get',
	})
}

export const setComment = async (data: CommentParam) => {
	return await request({
		url: '/comment',
		method: 'post',
		data,
	})
}

export const delComment = async (id: string) => {
	return request({
		url: `/comment/${id}`,
		method: 'delete',
	})
}
