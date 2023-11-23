<template>
	<div class="publish-container">
		<div class="publish-box" ref="publishRef">
			<div class="publish-box__header">
				<n-divider title-placement="left">
					<h2>
						发布管理 <n-number-animation ref="numberAnimationInstRef" :from="0" :to="publishState?.total" />
					</h2>
				</n-divider>
				<n-divider title-placement="right">
					<n-select
						size="tiny"
						style="width: 135px"
						v-model:value="query.sort"
						:options="sortOptions"
						@update:value="getPublishList"
					/>
					<n-select
						size="tiny"
						style="width: 80px"
						v-model:value="query.order"
						:options="orderOptions"
						@update:value="getPublishList"
					/>
				</n-divider>
			</div>
			<div class="publish-box__content" v-if="publishState">
				<div class="content-item" v-for="item in publishState.roomList" :key="item.hid">
					<div class="content-item-left">
						<picture>
							<img class="cover__img" v-if="item.cover" :src="item.cover" />
							<img class="cover__img" v-else src="@/assets/image/tomato.webp" />
						</picture>
					</div>
					<div class="content-item-right">
						<div class="content-item-right__header">
							<h3>{{ item.title }}</h3>
						</div>
						<!-- <div class="content-item-right__article" v-html="item.content"> -->
						<div class="content-item-right__content">
							<!-- <tiptapEditor ref="editorRef" theme="headless" v-model="item.content" /> -->
						</div>

						<div class="content-item-right__footer">
							<div class="date">
								{{ item.createdAt && format(item.createdAt, 'yyyy-MM-dd HH:mm:ss') }}
							</div>

							<n-button-group>
								<n-button type="primary" secondary size="small" @click="handleEdit(item)"
									>编辑</n-button
								>
								<n-button type="info" secondary size="small" @click="handleView(item)">查看</n-button>
							</n-button-group>
						</div>
					</div>
				</div>

				<n-space
					v-if="publishState.roomList.length === 0"
					justify="center"
					align="center"
					style="width: 100%; height: 180px"
				>
					<div>你还没有发布任何内容哦!</div>
				</n-space>
			</div>
			<div class="publish-box__footer">
				<n-divider />

				<n-pagination
					v-model:page="query.page"
					:page-sizes="[query.size]"
					:page-count="pageSize"
					@update:page="handleChangePage"
					show-quick-jumper
				>
					<template #goto> 跳转 </template>
				</n-pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, Component, reactive, onMounted, toRefs, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useRoomStore } from '@/store/room'
import { useRoute, useRouter } from 'vue-router'
import tiptapEditor from '@/components/rich-editor/tiptapEditor.vue'
import { format } from 'date-fns'
import { Room, RoomList } from '@/types/room'
import { Query } from '@/types/common'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const roomStore = useRoomStore()

const state = reactive<{
	publishState?: RoomList
	query: Query
}>({
	publishState: undefined,
	query: {
		page: route.query.page ? Number(route.query.page) : 1,
		size: 10,
		sort: 'createdAt',
		order: -1,
	},
})
const { query, publishState } = toRefs(state) //template中使用
const pageSize = computed(() => {
	let totalPage = 1
	if (state.publishState) {
		const total = state.publishState.total
		const size = state.query.size!
		totalPage = Math.floor((total + size - 1) / size)
	}

	return totalPage
})
const orderOptions = [
	{
		label: '正序',
		value: 1,
	},
	{
		label: '倒序',
		value: -1,
	},
]
const sortOptions = [
	{
		label: '创建时间排序',
		value: 'createdAt',
	},
	{
		label: '更新时间排序',
		value: 'updatedAt',
	},
]

const publishRef = ref<HTMLDivElement>()
const handleChangePage = (page: number) => {
	router.push({
		query: {
			page,
		},
	})

	getPublishList().then(() => {
		publishRef.value?.scrollIntoView({
			block: 'start',
			behavior: 'smooth',
		})
	})
}
const handleView = (data: Room) => {
	router.push({
		path: `/room/${data.hid}`,
	})
}
const handleEdit = (data: Room) => {
	router.push({
		path: `/creator/draw`,
		query: {
			id: data.hid,
		},
	})
}
// const handleChangeSort = () => {
// 	getPublishList()
// }

const getPublishList = async () => {
	window.$spin.add()
	const res = await roomStore.ROOM_MY_LIST(state.query)
	const { code, message, meta, data } = res.data
	if (code !== 200) {
	}
	state.publishState = data
	window.$spin.sub()
}

onMounted(() => {
	getPublishList()
})
</script>

<style lang="less" scoped>
.publish-container {
	width: 100%;
	height: 100%;
	// background: #e9ecef;
	// background-color: rgba(206, 255, 127, 0.5);
	// padding: 20px;
	display: flex;
	flex-direction: column;
	// align-items: center;
	// overflow-x: auto;
	overflow: auto;
}
.publish-box {
	flex: 1;
	width: 100%;
	max-width: 960px;
	min-width: 660px;
	margin: 0 auto;
	padding: 30px;
	background-color: #fff;
	// border-radius: 4px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.321);
}
.publish-box__header {
	margin-bottom: 20px;
	display: flex;
	justify-content: center;
}
.publish-box__content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 24px;
}
.publish-box__footer {
	margin: 20px 0px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.content-item {
	width: 100%;
	height: 180px;
	outline: 1px solid #e4edf4;
	border-radius: 4px;
	box-shadow: 0 0 2px rgba(51, 51, 51, 0.421);
	display: flex;
	// flex-wrap: wrap;
	// flex-direction: row;
	&-left {
		width: 320px;
		height: 100%;
		// background-color: rgba(127, 255, 212, 0.666);
		// display: flex;
		// flex-direction: column;
		// justify-content: space-between;
		// align-items: center;
		.cover__img {
			width: 320px;
			height: 180px;
			border-radius: 4px 0px 0px 4px;
			// object-fit: cover;//缩放会导致图像模糊
		}
	}
	&-right {
		// width: 100vw; //计算自适应宽度防止文字溢出
		// width:calc(100% - 320px);
		// min-width: 400px;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		// align-items: start;
		&__header {
			width: 100%;
			// max-height: 45px;
			padding: 5px;
			text-align: left;
			h3 {
				display: flex;
				overflow: hidden;
			}
		}
		&__content {
			width: 100%;
			max-height: 400px;
			padding: 10px;
			overflow: auto;
		}
		&__footer {
			// height: 50px;
			padding: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.date {
				color: #999;
			}
		}
	}
}
</style>
