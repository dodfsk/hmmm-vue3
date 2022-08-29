 import request from '@/utils/axios/index'

export  const getRoom=async (id?:string)=>{
    if (id) {
        return await request({
        url: `/room/${id}`,
        method: 'get',
        })
    }
    return await request({
        url: '/room',
        method: 'get',
    })
}

export const setRoom=async(data:object)=>{
    return await request({
        url: '/room',
        method: 'post',
        data
    })
}

export const delRoom=async(id:string)=>{
  return request({
    url: `/room/${id}`,
    method: 'delete',
  })
}



