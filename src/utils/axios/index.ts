import apiUrl from '@/api';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from '@/types/axios';
import { getToken, TOKEN_PREFIX } from '@/utils/common/auth';
import { defineComponent } from 'vue';
import { useUserStore } from '@/store/user';

//全局默认设置
axios.defaults.timeout = 15000; // 如果请求超时，请求将被中断
axios.defaults.withCredentials = false; // 是否携带cookie
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*'; // 允许跨域
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


//创建axios实例
const instance: AxiosInstance = axios.create({
	baseURL: apiUrl,
	//   baseURL: import.meta.env.BASE_URL + '',
	// transformRequest: [
	//   function (data) {
	//     //由于使用的 form-data传数据所以要格式化
	//     delete data.Authorization
	//     data = qs.stringify(data)
	//     return data
	//   },
	// ],
});

// axios实例  请求拦截器
instance.interceptors.request.use(
	// 在发送请求之前做些什么↓
	(config: AxiosRequestConfig) => {
		const token = getToken();
		if (token) {
			config.headers = { Authorization: `${TOKEN_PREFIX}${token}` };
		}
		// 让每个请求携带自定义 token, 可根据实际情况修改
		return config;
	},
	// 对请求错误做些什么↓
	(error: any) => {
		return Promise.reject(error);
	}
);

// axios实例  响应拦截器
instance.interceptors.response.use(
	// 对响应数据做点什么↓
	(response: AxiosResponse<Response>) => {
		// if (response.headers.authorization) {
		//   localStorage.setItem('app_token', response.headers.authorization)
		// } else if (response.data && response.data.token) {
		//   localStorage.setItem('app_token', response.data.token)
		// }
		const { data = {}, code, message, meta } = response.data;
		console.log('response', response);

		// if (response.status === 200) {
		// 	return response;
		// }
		if (code !== 200) {
			// 请求已发出，但是不在2xx的范围
			// window.$message.warning('nonono')
			window.$notification.error({
				title: 'error',
				content: message || '',
				meta: meta || '',
				duration: 2000,
			});
			if (code == 401 || code == 403) {
                const userStore=useUserStore()
				userStore.logOut();
			}
		} else {
			window.$notification.success({
				title: 'success',
				content: message || '',
				meta: meta || '',
				duration: 1000,
			});
		}
		return response;
	},
	// 对响应错误做点什么↓
	(error: any) => {
		console.log('error', error);
		if (error.response.status !== 200) {
			// if (error.code == 'ERR_NETWORK') {
			window.$notification.warning({
				title: 'warning',
				content: '接口请求失败',
				meta: '请检查服务器状态',
				duration: 2000,
			});
			return Promise.reject(error);
		}
		const { data = {}, code, meta, message } = error.response.data;
		if (code !== 200) {
			// 请求已发出，但是不在2xx的范围
			window.$notification.error({
				title: 'error',
				content: message || '',
				meta: meta || '',
				duration: 2000,
			});
		}
		return Promise.reject(data);
	}
);

export default instance;

export type { AxiosInstance, AxiosResponse };
