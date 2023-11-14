import request from '@/utils/axios/index'
import { ChangePswType, User ,UserParam } from '@/types/user'

export const login = async (data: UserParam) => {
	//登陆验证接口路径在auth
	return await request({
		url: '/auth/login',
		method: 'post',
		data,
	})
}

export const register = async (data: UserParam) => {
	return await request({
		url: '/user/register',
		method: 'post',
		data,
	})
}

export const changePassword = async (data: ChangePswType) => {
	return await request({
		url: '/user/changePassword',
		method: 'post',
		data,
	})
}

export const findMyself = async () => {
	return await request({
		url: '/user/findMyself',
		method: 'post',
	})
}

export const updateMyself = async (data: UserParam) => {
	return await request({
		url: '/user/updateMyself',
		method: 'post',
		data,
	})
}

export const removeMyself = async () => {
	return await request({
		url: '/user/removeMyself',
		method: 'post',
	})
}

export const getUser = async (id: string) => {
	if (id) {
		return request({
			url: `/user/${id}`,
			method: 'get',
		})
	}
	return request({
		url: '/user',
		method: 'get',
	})
}

//root接口//
/////////////
export const setUser = async (uid: string, data: UserParam) => {
	return request({
		url: `/user/${uid}`,
		method: 'patch',
		data,
	})
}

export const delUser = async (uid: string) => {
	return request({
		url: `/user/${uid}`,
		method: 'delete',
	})
}
