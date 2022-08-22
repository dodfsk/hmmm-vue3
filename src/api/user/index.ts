import request from '@/utils/axios/index'
import { User } from '@/types/user'

export async function hello(params = {}) {
    return await request({
      url: '/user/hello',
      method: 'get',
      params
    })
  }

export async function helloP(data = {}) {
return await request({
    url: '/user/helloP',
    method: 'post',
    data
})
}

export async function login(data = {}) {
return await request({
    url: '/user/login',
    method: 'post',
    data
})
}

export async function register(data = {}) {
return await request({
    url: '/user/register',
    method: 'post',
    data
})
}

export function getUser(id:string) {
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

export function setUser(data:User) {
    return request({
      url: `/user/${data.username}`,
      method: 'patch',
      data,
    })
}

export function delUser(data:User) {
    return request({
      url: `/user/${data.username}`,
      method: 'delete',
      data,
    })
}
