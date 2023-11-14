import { AxiosResponse } from 'axios'

// 返回res.data的interface
export interface ResponseData<T = Object> {
	data: T // 默认结果为空对象
	message: string // 正确/错误提示
	code: number // 自定义code
	meta?: string //正确/错误副提示
	timestamp?: number
	url?: string // 正确/错误的url地址
}

export type Res<T=Object>=AxiosResponse<ResponseData<T>>
