import { defineStore } from 'pinia'
import { Names } from '@/store/store-name'
import { reactive, computed, onMounted } from 'vue'
import { getCommentList, getComment, setComment, delComment } from '@/api/comment'
import { Comment, CommentList, CommentParam } from '@/types/comment'
import { Query } from '@/types/common'
import { cloneDeep } from 'lodash-es'

export const useCommentStore = defineStore(
	Names.COMMENT,
	() => {
		// const COMMENT_LIST=async(query?:object)=> {
		//     const res = await getRoomList(query)
		//     const { code,data={}  } = res.data;
		//     if (code === 200) {
		//         if(data.roomList){
		//             // data.roomList.forEach((item:Room) => {
		//             //     item.createdAt=new Date(item.createdAt!)
		//             //     if(item.content){
		//             //         item.content=ImgReplace(item.content)//替换img地址
		//             //     }
		//             // });
		//         }
		//     }
		//     return res
		// }

		const COMMENT_GET_LIST = async (id: string, query?: Query) => {
			const res= await getCommentList(id, query)
			const { code, data } = res.data
			if (code === 200) {
				data.commentList.forEach((item: Comment) => {
					item.createdAt = new Date(item.createdAt!)
				})
			}
			return res
		}

		const COMMENT_SET = async (params: CommentParam) => {
			const res = await setComment(params)
			const { code, data } = res.data
			return res
		}

		const COMMENT_DEL = async (id: string) => {
			const res = await delComment(id)
			const { code, data } = res.data
			return res
		}

		
		return {
			COMMENT_GET_LIST,
			COMMENT_SET,
			COMMENT_DEL,
		}
	},
	{
		persist: {
			//pinia持久化插件
			enabled: true, //开启持久化
			strategies: [
				{
					storage: localStorage, //默认存储在sessionStorage
					key: `Pinia-${Names.COMMENT}`, //默认为$id
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
