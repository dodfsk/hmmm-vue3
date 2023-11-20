<template>
	<div class="room-container">
		<!-- <n-skeleton height="250px"  /> -->

		<div class="room-header">
			<h1>文章</h1>
		</div>

		<div class="room-grid" v-if="roomState">
			<div class="room-card" :title="item.title" v-for="item in roomState.roomList" :key="item.hid">
				<a :href="`/room/${item.hid}`" target="_blank">
					<picture>
						<source v-if="item.cover" :srcset="item.cover" />
						<img class="room-card__img" src="@/assets/image/tomato.webp" @error="imgError" />
					</picture>
				</a>
				<div class="room-card__info">
					<div class="room-card__info--title">
						{{ item.title }}
					</div>

					<div class="room-card__info--bottom">
						<div class="button">
							<n-button
								type="info"
								size="tiny"
								strong
								secondary
								v-debounce:click="() => handleShowModal(item.hid)"
							>
								<template #icon>
									<n-icon :component="Search" />
								</template>
							</n-button>

							<n-button type="primary" size="tiny" strong secondary @click="roomEnter(item.hid)">
								<template #icon>
									<n-icon :component="ArrowUp" />
								</template>
							</n-button>
						</div>
						<div class="from">
							{{ item.from?.username }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="skeleton-grid" v-if="!roomState">
			<n-skeleton height="1200px" />
		</div>

		<div class="room-footer">
			<div class="pagination">
				<n-pagination
					v-model:page="query.page"
					:page-sizes="[query.size]"
					:page-count="pageCount"
					@update:page="handleChangePage"
					show-quick-jumper
				>
					<template #goto> 跳转 </template>
				</n-pagination>
			</div>
		</div>
	</div>
	<ViewWindow v-model:show="showModal" :roomState="roomData!" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, toRefs, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
import { Search, ArrowUp, HeartOutline } from '@vicons/ionicons5'
import { useRoomStore } from '@/store/room'
import { Room, RoomList } from '@/types/room'

import ViewWindow from './components/ViewWindow.vue'
import { Query } from '@/types/common'

const router = useRouter()
const route = useRoute()
const roomStore = useRoomStore()
const showModal = ref(false)
const roomData = ref<Room>()

const state = reactive<{
	roomState?: RoomList
	query: Query
}>({
	roomState: undefined,
	query: {
		page: route.query.page ? Number(route.query.page) : 1,
		size: 100, //待修改,grid布局无法平铺,需动态调整size
	},
})
const { roomState, query } = toRefs(state) //template中使用

const pageCount = computed(() => {
	let totalPage = 1
	if (state.roomState) {
		const total = state.roomState.total
		const size = state.query.size!
		totalPage = Math.floor((total + size - 1) / size)
	}

	return totalPage
})

const imgError = (e: any) => {
	const img = e.target
	img.src = '/src/assets/image/tomato.webp'
}

const roomDraw = () => {
	router.push({
		path: `/creator/draw`,
	})
}

const roomEnter = (hid?: string) => {
	router.push({
		path: `/room/${hid}`,
	})
}
const handleShowModal = async (hid: string) => {
	window.$spin.add()
	router.push({
		query: { ...route.query, window: hid },
	})
	const res = await roomStore.ROOM_GET(hid)
	const { code, data } = res.data
	if (code == 200) {
		roomData.value = data
		showModal.value = true
		window.$spin.sub()
	}
}
const handleChangePage = (page: number) => {
	getRoomList(state.query).then(() => {
		window.scrollTo({ top: 0 })
	})
}
const getRoomList = async (query: Query) => {
	// window.$spin.add()
	const res = await roomStore.ROOM_LIST(query)
	const { code, data } = res.data
	if (res.status == 200) {
		state.roomState = data
		// window.$spin.sub()
	}
}

onMounted(() => {
	getRoomList(state.query)
})

// watch(
//     ()=>route.query,
//     (newValue, oldValue)=>{
//         console.log('newValue, oldValue',newValue, oldValue);
//         if(!newValue.window&&!oldValue?.window)
//             if(route.name=='room'||route.name=='search')
//                 getRoomList()
//     },
//     {immediate:true,deep:true}
// )
</script>

<style lang="less" scoped>
// @import '@/views/root.less';

.room-container {
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 50px);
	// margin: 0 auto;
	// background-color: #ccc;
	// background-color: rgb(233, 233, 233);
}
.room-header {
	padding: 10px 0;
}
.room-footer {
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	.pagination {
		margin: 24px 0px;
	}
}
.room-grid {
	width: 100%;
	justify-content: space-evenly;
	position: relative;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
	grid-gap: 20px 12px;
}
.room-card {
	// background-color: #fff;
	// box-shadow: 20px 20px 60px #ced1d6,-20px -20px 60px #fff;
	// outline: 3px solid #000;
	&__img {
		outline: 1px solid #e4edf4;
		border-radius: 8px;
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}
}
.room-card__info {
	height: 82px;
	min-height: 4rem;
	// display: flex;
	// flex-direction: column;
	// justify-content: space-between;
	&--title {
		// flex-grow: 2;
		height: 56px;
		font-size: 1rem;
		font-weight: bold;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		line-break: anywhere;
	}
	&--bottom {
		// flex-grow: 1;
		height: 26px;
		display: flex;
		justify-content: space-between;
		color: rgb(126, 126, 126);
		.button {
			width: 60px;
		}
		.from {
			max-width: 100px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}

@media (max-width: 1099.9px) {
	.room-container {
		padding: 0 36px;
	}
}
@media (min-width: 1100px) and (max-width: 1366.9px) {
	.room-container {
		// padding: 0 56px;
		padding: 0 64px;
	}
}

@media (min-width: 1367px) and (max-width: 1700.9px) {
	.room-container {
		padding: 0 64px;
	}
}
@media (min-width: 1701px) and (max-width: 2199.9px) {
	.room-container {
		padding: 0 96px;
	}
}

@media (min-width: 2200px) {
	.room-container {
		padding: 0 96px;
	}
}
</style>
