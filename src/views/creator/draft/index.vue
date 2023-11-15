<template>
	<div class="draft-container">
		<div class="draft-box">
			<div class="header">
				<n-divider title-placement="left">
					<h2>
						草稿箱
						<n-number-animation ref="numberAnimationInstRef" :from="0" :to="draftState?.total" />
					</h2>
				</n-divider>
			</div>
			<div class="content">
				<n-list class="content-list" hoverable clickable show-divider borderd style="width: 100%">
					<!-- <template #header>
                        草稿列表
                    </template>  -->
					<!-- <template #footer>
                        底部
                    </template> -->
					<n-list-item v-for="item in draftState?.roomList" :key="item._id" class="content-list-item">
						<template #suffix>
							<n-button-group>
								<n-button round secondary @click="draftEdit(item)">编辑</n-button>
								<n-button round secondary v-debounce:click="()=>draftDelete(item)">删除</n-button>
							</n-button-group>
						</template>
						<div>{{ item.title }}</div>
						<div>{{ item.intro }}</div>
					</n-list-item>
					<n-space
						v-if="draftState && !draftState.total"
						justify="center"
						align="center"
						style="width: 100%; height: 180px"
					>
						<div>你还没有草稿呢,点击绘制创建模板吧</div>
					</n-space>
				</n-list>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, Component, reactive, onMounted, computed, toRefs } from 'vue'
import { useUserStore } from '@/store/user'
import { useRoomStore } from '@/store/room'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { Room, RoomList } from '@/types/room'
import { Query } from '@/types/common'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const roomStore = useRoomStore()
const state = reactive<{
	draftState?: RoomList
	query: Query
}>({
	draftState: undefined,
	query: {
		// page: route.query.page ? Number(route.query.page) : 1,
		// size: 10,
		sort: 'createdAt',
		order: -1,
	},
})
const { query, draftState } = toRefs(state) //template中使用
// const pageSize = computed(() => {
// 	let totalPage = 1
// 	if (state.draftState) {
// 		const total = state.draftState.total
// 		const size = state.query.size
// 		totalPage = Math.floor((total + size - 1) / size)
// 	}

// 	return totalPage
// })
const options = [
	{
		label: '创建时间排序',
		value: 'createdAt',
	},
	{
		label: '更新时间排序',
		value: 'updatedAt',
	},
]
const draftEdit = (data: Room) => {
	router.push({
		path: `/creator/draw`,
		query: {
			id: data.hid,
		},
	})
}

const draftDelete = async  (data: Room) => {
	const res = await roomStore.ROOM_DEL(data.hid!)
	const { code, message, meta } = res.data
	if (code == 200) {
		if (state.draftState) {
			state.draftState.roomList = state.draftState.roomList.filter((item) => item.hid !== data.hid)
			state.draftState.total--
		}
	}
}

const getDraftList = async () => {
    window.$spin.add()
	const res = await roomStore.ROOM_MY_LIST({ ...state.query, status: 0 })
	const { code, message, meta, data } = res.data
	if (code !== 200) {
		return
	}
	if (draftState) {
		state.draftState = data
        window.$spin.sub()
	}
}
onMounted(() => {
	getDraftList()
})
</script>

<style lang="less" scoped>
.draft-container {
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}
.draft-box {
	margin: 0 auto;
	width: 100%;
	max-width: 960px;
	// min-height: 800px;
	// height: calc(100vh - 50px);
	// height:100%;
	padding: 30px 0;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.721);
	display: flex;
	flex-direction: column;
	align-items: center;

	.header {
		width: 100%;
	}
	.content {
		width: 100%;
		flex: 1 1;
		// display: flex;
		// flex-direction: column;
		// align-items: start;
		// gap: 24px;
	}
	// .content-list{
	//     // padding:50px;
	// }
}

.circle {
	width: 100px;
	height: 100px;
	padding: 3px;
	// border: 1px solid #000;
	border-radius: 50px;
	background-color: darkslateblue;
	text-align: center;
}
</style>
