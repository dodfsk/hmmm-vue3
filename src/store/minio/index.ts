import { defineStore } from 'pinia'
import { upload, download, remove, getUploadUrl, putObecjt } from '@/api/minio'
import { Names } from '@/store/store-name'
import { reactive, computed, onMounted } from 'vue'
import { Res } from '@/types/axios'
import { MinioParam } from '@/types/minio'

export const useMinioStore = defineStore(
	Names.MINIO,
	() => {
		const MINIO_SET = async (param?: object) => {
			const res = await upload(param)
			const { code, data } = res.data
			return res
		}
		//预签名直传url
		const MINIO_GET_URL = async (param: MinioParam) => {
			const res: Res<{ url: string }> = await getUploadUrl(param)
			const { code, data } = res.data
			return res
		}
		//根据预签名url使用Put方法
		const MINIO_PUT = async (param?: object) => {
			const res = await putObecjt(param)
			const { code, data } = res.data
			return res
		}

		const MINIO_GET = async (param?: object) => {
			const res = await download(param)
			const { code, data } = res.data
			return res
		}
		const MINIO_DEL = async (param?: object) => {
			const res = await remove(param)
			const { code, data } = res.data
			return res
		}

		return {
			MINIO_SET,
			MINIO_GET_URL,
			MINIO_PUT,
			MINIO_GET,
			MINIO_DEL,
		}
	}
	//   {
	//     persist:{//pinia持久化插件
	//         enabled:true,//开启持久化
	//         strategies:[
	//             {
	//                 storage:localStorage,//默认存储在sessionStorage
	//                 key:`Pinia-${Names.ROOM}`,//默认为$id
	//                 // paths:['name'],//指定存储,默认为全部
	//             },
	//             // {
	//             //     storage:sessionStorage,
	//             //     key:`Pinia-${Names.USER}`,
	//             //     paths:['name','id']
	//             // }
	//         ]
	//     }
	//   }
)
