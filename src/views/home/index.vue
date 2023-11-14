<template>
	<div class="home__container">
		<div style="width: 100%; height: 250px; background-color: rgba(0, 0, 0, 0.7)"></div>

		<div class="home__content">
			<div style="display: flex; gap: 24px; padding: 10px 0px">
				<n-button type="primary" v-debounce:click="handleRandom">随机</n-button>
				<n-button type="info" @click="handleWait">功能1</n-button>
				<n-button type="warning" @click="handleWait">功能2</n-button>
				<n-button type="error" @click="handleWait">功能3</n-button>
				<n-button color="#ff69b4" @click="handleWait">功能4</n-button>
			</div>
			<h2>文章分区</h2>

			<div class="room-grid" v-if="roomList">
				<div class="room-card" :title="item.title" v-for="item in roomList" :key="item.hid">
					<a :href="`/room/${item.hid}`" target="_blank">
						<picture>
							<img class="room-card__img" v-if="item.cover" :src="item.cover" />
							<img class="room-card__img" v-else src="@/assets/image/tomato.webp" />
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
		</div>
	</div>
	<ViewWindow v-model:show="showModal" :roomState="roomData!" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
import { Search, ArrowUp } from '@vicons/ionicons5'
import { useRoomStore } from '@/store/room'
import { Room } from '@/types/room'

import ViewWindow from '@/views/room/components/ViewWindow.vue'

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

const handleWait=()=>{
    window.$message.info('等待添加')
}

const handleRandom=()=>{
    const cursor=Math.floor(Math.random()*8)
    const hid=roomList.value![cursor].hid
    handleShowModal(hid)
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
	const { keyword } = route.query
	let query: any | undefined = {}
	if (keyword) {
		query = { from: keyword }
	}
    query.size=8
	const res = await roomStore.ROOM_LIST(query)
	const { code, data } = res.data
	if (res.status == 200) {
		roomList.value = data.roomList
	}
}

onMounted(() => {
	getRoomList()
	// getCoinList()
})
</script>

<style lang="less" scoped>
.home__container {
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 50px);
	// padding: 20px 0;
	// display: flex;
	// margin:0 auto;
	// flex-direction: column;
	// justify-content:space-evenly;
	// align-items: center;
	// overflow: auto;
	margin: 0 auto;
	// background-color: #ccc;
	// background-color: rgb(233, 233, 233);
}

.room-grid {
	width: 100%;
	justify-content: space-evenly;
	position: relative;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
	grid-template-rows: repeat(3, 1fr);
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
	.home__content {
		padding: 0 36px;
	}
}
@media (min-width: 1100px) and (max-width: 1366.9px) {
	.home__content {
		padding: 0 56px;
	}
}

@media (min-width: 1367px) and (max-width: 1700.9px) {
	.home__content {
		padding: 0 64px;
	}
}
@media (min-width: 1701px) and (max-width: 2199.9px) {
	.home__content {
		padding: 0 96px;
		max-width: 2270px;
	}
}
</style>
