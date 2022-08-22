import apiUrl from "@/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { showMessage } from "./status";
import { Response } from "@/types/axios";
import { getToken } from "@/utils/auth";
import { useNotification, useMessage } from "naive-ui";
import { defineComponent } from 'vue'

//全局默认设置
axios.defaults.timeout = 15000; // 如果请求超时，请求将被中断
axios.defaults.withCredentials = false; // 是否携带cookie
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
axios.defaults.headers.post["Access-Control-Allow-Origin-Type"] = "*"; // 允许跨域
axios.defaults.headers.post["Content-Type"] ="application/x-www-form-urlencoded";

const Nmessage = useMessage();
const Nnotification = useNotification();
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
			// config.headers.Authorization = `${TokenPrefix}${token}`
		}
        // 如果 token 存在
        // 让每个请求携带自定义 token, 请根据实际情况修改
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
		const { data = {}, status, message,meta } = response.data;
        console.log('response',response);
        
		// if (response.status === 200) {
		// 	return response;
		// }
        if (status!=='200') {
			// 请求已发出，但是不在2xx的范围
            // window.$message.warning('nonono')
            window.$notification.error({
                title:'error',
                content: message||'',
                meta: meta||'',
                duration: 3000,
            })
    }
		return response;
	},
	// 对响应错误做点什么↓
	(error: any) => {
		const { data = {}, status, message } = error.response;
        console.log('error',error);
        
		if (status!=='200') {
			// 请求已发出，但是不在2xx的范围
			window.$notification.warning({
                title:'warning',
                content:'接口请求失败',
                // meta: '接口请求失败',
                duration: 3000,
            });
		}
        return Promise.reject(data);
	}
);

// 封装request方法
// const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
// 	const conf = config;
// 	return new Promise((resolve,reject) => {
// 		instance
// 			.request<any, AxiosResponse<Response>>(conf)
// 			.then((res: AxiosResponse<Response>) => {
// 				// resolve(res as unknown as Promise<T>);
// 				const {
// 					data: { data },
// 				} = res;
// 				resolve(data as T);
// 			})
//             .catch((err) => {
//                 reject(err)
//                 return err
//               })
//             ;
// 	});
// };

// const request = <T = any>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
//   if (typeof config === 'string') {
//     if (!options) {
//       return instance.request<T, T>({
//         url: config,
//       });
//       // throw new Error('请配置正确的请求参数');
//     } else {
//       return instance.request<T, T>({
//         url: config,
//         ...options,
//       });
//     }
//   } else {
//     return instance.request<T, T>(config);
//   }
// };



// export default request;

export default instance;

export type { AxiosInstance, AxiosResponse };
