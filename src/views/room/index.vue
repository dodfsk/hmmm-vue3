<template>
	<div class="room-container">
		<!-- <n-skeleton height="250px"  /> -->

		<div class="room-header">
			<h1>文章</h1>
		</div>

		<div class="room-grid" v-if="roomList">
			<div class="room-card" :title="item.title" v-for="item in roomList" :key="item.hid">
				<a :href="`/room/${item.hid}`" target="_blank">
					<picture>
						<source v-if="item.cover" :srcset="item.cover" />
						<img class="room-card__img" src="@/assets/image/tomato.webp" />
					</picture>
				</a>
				<div class="room-card__info">
					<div class="room-card__info--title">
						{{ item.title }}
					</div>

					<div class="room-card__info--bottom">
						<div class="button">
							<n-button type="info" size="tiny" strong secondary @click="handleShowModal(item.hid)">
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

		<div class="skeleton-grid" v-if="!roomList">
			<n-skeleton height="250px" v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" />
		</div>

        <div class="room-footer">

        </div>
	</div>
	<ViewWindow  v-model:show="showModal" :roomState="roomData!" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
import { Search, ArrowUp, HeartOutline } from '@vicons/ionicons5'
import { useRoomStore } from '@/store/room'
import { Room } from '@/types/room'

import ViewWindow from './components/ViewWindow.vue'

const router = useRouter()
const route = useRoute()
const roomStore = useRoomStore()
const showModal = ref(false)
const roomData = ref<Room>()
const roomList = ref<Array<Room>>()

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

const getRoomList = async () => {
    // window.$spin.add()
	const res = await roomStore.ROOM_LIST()
	const { code, data } = res.data
	if (res.status == 200) {
		roomList.value = data.roomList
        // window.$spin.sub()
	}
}

onMounted(() => {
	getRoomList()
	// getCoinList()
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
.room-footer{
    height: 90px;
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
		max-width: 2270px;
	}
}
</style>
