import { defineStore } from 'pinia'
import {
	login,
	register,
	setUser,
	delUser,
	getUser,
	changePassword,
	updateMyself,
	removeMyself,
	findMyself,
} from '@/api/user'
import { setToken, getToken, delToken } from '@/utils/common/auth'
import { Names } from '@/store/store-name'
import { ref, computed, onMounted } from 'vue'
import { ChangePswType, User, UserParam } from '@/types/user'
import { Res } from '@/types/axios'

// import _ from 'lodash-es'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
	Names.USER,
	() => {
		//state
		const router = useRouter()
		// const init: UserParam = {
		// 	uid: undefined,
		// 	username: undefined,
		// 	// password: undefined,
		// 	role: undefined,
		// 	phone: undefined,
		// 	email: undefined,
		// 	birth: undefined,
		// 	avatar: undefined,
		// }
		let userInfo = ref<User>()

		//action
		const USER_LOGIN = async (params: UserParam) => {
			const res: Res<{ token: string }> = await login(params)
			const { code, data } = res.data
			if (code === 200) {
				setToken(data.token)
				await USER_GET_MY()
			}
			return res
		}
		const USER_REG = async (params: UserParam) => {
			const res: Res<User> = await register(params)
			const { code, data } = res.data

			// if (code === 200) {
			//     setUserInfo(params)
			// }
			return res
		}

		const USER_CHANGE_PSW = async (params: ChangePswType) => {
			const res = await changePassword(params)
			const { code, data } = res.data

			return res
		}
		const USER_GET_MY = async () => {
			const res: Res<User> = await findMyself()
			const { code, data } = res.data
			if (code === 200) {
				setUserInfo(data)
				if (data.birth) {
					data.birth = new Date(data.birth)
				}
			}
			return res
		}

		const USER_GET = async (id: string) => {
			const res: Res<User> = await getUser(id)
			const { code, data } = res.data
			if (code === 200) {
				if (data.birth) {
					data.birth = new Date(data.birth)
				}
			}
			return res
		}

		const USER_SET = async (params: UserParam) => {
			const res: Res<User> = await updateMyself(params)
			const { code, data } = res.data

			if (code === 200) {
				setUserInfo(data)
			}
			return res
		}

		const USER_DEL = async () => {
			const res = await removeMyself()
			const { code } = res.data

			return res
		}

		//无接口调用
		const setUserInfo = (data: User) => {
			userInfo.value = data
			//手动存入localStorage方式
			//转换为字符串存入localStorage
			// localStorage.setItem('userInfo',JSON.stringify(userInfo))
		}
		const logOut = () => {
			// Object.assign(userInfo.value!,init)
			userInfo.value = undefined
			localStorage.removeItem('Pinia-USER')
			delToken()
			router.push({
				path: '/auth/login',
			})
		}

		//手动存入localStorage方式
		// onMounted(() => {
		//     let obj=localStorage.getItem("userInfo");
		//     if(obj!=null){
		//         userInfo.username=JSON.parse(obj).username
		//         userInfo.password=JSON.parse(obj).password
		//         Object.assign(userInfo,JSON.parse(obj))
		//     }
		// })

		return {
			userInfo,
			USER_LOGIN,
			USER_REG,
			USER_CHANGE_PSW,
			USER_SET,
			USER_DEL,
			USER_GET_MY,
			USER_GET,
			logOut,
			setUserInfo,
		}
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
