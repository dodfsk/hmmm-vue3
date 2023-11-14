import { defineStore } from 'pinia'
import { getRoom, getRoomList, getMyRoomList, setRoom, putRoom, delRoom, updateStatus } from '@/api/room'
// import { removeToken } from '@/utils/common/token'
// import { toLogin } from '@/utils/common/auth'
import { Names } from '@/store/store-name'
import { reactive, computed, onMounted } from 'vue'
import { PreSignInfo, Room, RoomList } from '@/types/room'
import { Res } from '@/types/axios'
import { cloneDeep } from 'lodash-es'

export const useRoomStore = defineStore(
	Names.ROOM,
	() => {
		const ROOM_LIST = async (query?: object) => {
			const res: Res<RoomList> = await getRoomList(query)
			const { code, data } = res.data
			if (code === 200) {
				if (data.roomList) {
					data.roomList.forEach((item: Room) => {
						item.createdAt = new Date(item.createdAt!)
					})
				}
			}
			return res
		}

		const ROOM_MY_LIST = async (params: any) => {
			const res: Res<RoomList> = await getMyRoomList(params)
			const { code, data } = res.data
			if (code === 200) {
				if (data.roomList) {
					data.roomList.forEach((item: Room) => {
						item.createdAt = new Date(item.createdAt!)
					})
				}
			}
			return res
		}
		const ROOM_UPD_STATUS = async (id: string, params: Partial<Room>) => {
			const res: Res<Room> = await updateStatus(id, params)
			const { code, data } = res.data
			return res
		}

		const ROOM_GET = async (id: string) => {
			const res: Res<Room> = await getRoom(id)
			const { code, data } = res.data
			if (code === 200) {
				data.createdAt = new Date(data.createdAt!)
			}
			return res
		}

		const ROOM_SET = async (params: Partial<Room>) => {
			const roomState = cloneDeep(params)
			const res: Res<Room> = await setRoom(roomState)
			const { code, data } = res.data
			return res
		}
		const ROOM_PUT = async (params: Partial<Room>) => {
			const roomState = cloneDeep(params)

			const res: Res<Room> = await putRoom(roomState)
			const { code, data } = res.data
			return res
		}

		const ROOM_DEL = async (id: string) => {
			const res = await delRoom(id)
			const { code, data } = res.data
			return res
		}

		return {
			ROOM_LIST,
			ROOM_MY_LIST,
			ROOM_UPD_STATUS,
			ROOM_GET,
			ROOM_SET,
			ROOM_PUT,
			ROOM_DEL,
		}
	},
	{
		persist: {
			//pinia持久化插件
			enabled: true, //开启持久化
			strategies: [
				{
					storage: localStorage, //默认存储在sessionStorage
					key: `Pinia-${Names.ROOM}`, //默认为$id
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
