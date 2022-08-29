// 返回res.data的interface
export interface Response<T = any> {
	message?: string;
	meta?: string;
	code: number;
	timestamp?: number;
	data?: T;
	url?: string; // 正确/错误的url地址
}
