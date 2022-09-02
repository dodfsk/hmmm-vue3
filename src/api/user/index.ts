import request from '@/utils/axios/index'
import { User } from '@/types/user'

export  const login=async (data = {})=>{
return await request({
    url: '/user/login',
    method: 'post',
    data
})
}

export  const register=async (data = {})=>{
return await request({
    url: '/user/register',
    method: 'post',
    data
})
}

export const getUser=async (id:string)=>{
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

export const setUser=async (data:User)=>{
    const { username } = data
    return request({
      url: `/user/${username}`,
      method: 'patch',
      data,
    })
}

export const delUser=async (data:User)=>{
    return request({
      url: `/user/${data.username}`,
      method: 'delete',
      data,
    })
}
