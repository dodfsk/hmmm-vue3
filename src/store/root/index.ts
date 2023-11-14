import { defineStore } from 'pinia'
import { Names } from '@/store/store-name'
import { Res } from '@/types/axios'

export const useUserStore = defineStore(
	Names.USER,
	() => {
		
	},
	{
		persist: {
			//pinia持久化插件
			enabled: true, //开启持久化
			strategies: [
				{
					storage: localStorage, //默认存储在sessionStorage
					key: `Pinia-${Names.USER}`, //默认为$id
					// paths:['name'],//指定存储,默认为全部
				},
				// {
				//     storage:sessionStorage,
				//     key:`Pinia-${Names.USER}`,
				//     paths:['name','id']
				// }
			],
		},
	}
)