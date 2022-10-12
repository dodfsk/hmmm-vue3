import request from '@/utils/axios/index'
import axios from 'axios'

export  const upload=async (data = {})=>{
    return await request({
        url: '/upload',
        method: 'post',
        data
    })
}

export  const getUploadUrl=async (data = {})=>{
    return await request({
        url: '/upload/getUrl',
        method: 'post',
        data
    })
}

export  const putObecjt=async (params:any)=>{
    const { url,headers,data={} }=params
    console.log('params',params);
    return await axios({
        url,
        headers,
        method: 'put',
        data
    })
}

export  const download=async (data = {})=>{
    return await request({
        responseType: 'stream',//设置axios返回buffer数据流
        url: '/assest/download',
        method: 'post',
        data
    })
}

