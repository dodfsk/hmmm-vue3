<template>
	<n-modal
		preset="card"
		size="huge"
		transform-origin="center"
		@after-leave="handleCloseModal"
		:style="{
			maxWidth: '840px',
		}"
	>
		<template #cover>
			<img :src="roomState.cover" />
		</template>
		<template #header>
			<h2 style="font-weight: 500">
				{{ roomState.title }}
			</h2>
		</template>
		<template #header-extra> </template>
		<div class="up-pannel">
			<n-avatar
				:size="42"
				:src="roomState.from.avatar ?? 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'"
				fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
				style="padding: 0; margin: 0; user-select: none;border:1px solid #e4edf4;"
				round
			/>
			<div class="up-info">
				<strong class="up-name">
					{{ roomState.from.username }}
				</strong>
				<div class="up-stats"></div>
			</div>
		</div>
        <div class="divider"></div>

		<tiptapEditor ref="editorRef" theme="headless" v-model="roomState.content" />

		<template #footer> </template>

		<template #action>
			<div class="footer">
				<div class="action">
					<n-button text>
						<n-icon size="20px" color="#666" :component="HeartOutline"></n-icon>
					</n-button>
					<n-button text @click="handleReply(roomState.hid)">
						<n-icon size="20px" color="#666" :component="ArrowUndoOutline"></n-icon>
					</n-button>
				</div>

				<div class="stats">
					<div class="time-area">
						{{ roomState?.createdAt && format(roomState.createdAt, 'yyyy-MM-dd HH:mm:ss') }}
					</div>
					<div class="stats-area">{{ roomState?.stats.floors }}评论</div>
				</div>
			</div>
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HeartOutline, ArrowUndoOutline } from '@vicons/ionicons5'
import { format } from 'date-fns'
import { useRoomStore } from '@/store/room'
import { Room } from '@/types/room'

import tiptapEditor from '@/components/rich-editor/tiptapEditor.vue'

const router = useRouter()
const route = useRoute()
const roomStore = useRoomStore()

type Props = {
	roomState: Room
}
type Emits = {
	// (e: 'update:show', value: boolean): void //双向绑定show值
	(e: 'handleModalOk', value: boolean): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const { roomState } = toRefs(props) //template中使用

const handleCloseModal = () => {
	const { window, ...backQuery } = route.query
	//解构取反
	router.push({ query: backQuery })
}

const handleReply = (hid: string) => {
	router.push({
		path: `/room/${hid}`,
	})
	//临时处理
	setTimeout(() => {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth',
		})
	}, 500)
}
</script>

<style lang="less" scoped>
.divider {
	height: 1px;
	width: 100%;
	background: rgba(114, 114, 114, 0.3);
	margin: 12px 0px 20px;
}


.up-pannel {
	display: flex;
	align-items: center;
}
.up-name {
	font-size: 18px;
	line-height: 18px;
	color: #00965e;
}
.footer {
	display: flex;
	justify-content: space-between;
}
.action {
	display: flex;
	gap: 12px;
}
.stats {
	padding: 0 12px;
	font-size: 13px;
	display: flex;
	gap: 24px;
	.time-area {
		color: #99a2aa;
	}
	.stats-area {
		color: #99a2aa;
	}
}
</style>
