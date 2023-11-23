<template>
	<div class="room-container">
		<!-- 面包屑 -->
		<div class="room-breadcrumb">
			<n-breadcrumb>
				<n-breadcrumb-item
					@click="
						router.push({
							path: '/room',
						})
					"
				>
					<n-icon :component="Square" /> Room</n-breadcrumb-item
				>
				<n-breadcrumb-item>
					<div>{{ roomState?.hid }}</div>
				</n-breadcrumb-item>
			</n-breadcrumb>
		</div>
		<!-- 文章容器 -->
		<div class="article-container">
			<div class="article-container__header">
				<div class="article-title">
					<h1>{{ roomState?.title }}</h1>
				</div>
				<div class="article-pannel">
					<div class="article-pannel-left">
						<div class="up-face">
							<n-avatar
								:size="56"
								:src="
									roomState?.from?.avatar ??
									'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
								"
								fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
								style="padding: 0; margin: 0; user-select: none; border: 1px solid #e4edf4"
								round
							/>
						</div>

						<div class="up-info">
							<strong class="up-name">
								{{ roomState?.from.username }}
							</strong>
							<div class="up-stats">
								粉丝:{{ roomState?.from.stats?.fans }} 稿件:{{ roomState?.from.stats.rooms }}
							</div>
						</div>
					</div>
					<div class="article-pannel-right">
						<n-button-group v-if="roomState && userStore.userInfo?.username == 'hmlc'">
							<n-button type="primary" round @click="handleEdit" size="small"> 编 辑 </n-button>
							<!-- <n-button type="error" round @click="handleDel" size="small"> 删 除 </n-button> -->
						</n-button-group>
					</div>
				</div>
				<div class="article-stats">
					<div class="time-area">
						{{ roomState?.createdAt && format(roomState.createdAt, 'yyyy-MM-dd HH:mm:ss') }}
					</div>
					<div class="stats-area">{{ roomState?.stats.floors }}评论</div>
				</div>
				<div class="divider"></div>
			</div>

			<div class="article-container__content">
				<n-skeleton v-if="!roomState" :sharp="false" style="height: 400px" />
				<div class="edit-box" v-if="roomState">
					<tiptapEditor theme="headless" v-model="roomState.content"> </tiptapEditor>
				</div>

				<!-- :readOnly="true" -->
			</div>
			<div class="article-container__footer"></div>
		</div>
		<!-- 评论区容器 -->
		<div class="comment-container" ref="commentRef">
			<div class="comment-container__header">
				<h2>{{ commentState?.total }} 地板</h2>
			</div>
			<div class="comment-container__content">
				<template v-if="commentState">
					<div class="comment-card" v-for="item in commentState.commentList" :key="item._id">
						<div class="comment-card__header">
							<div class="comment-pannel">
								<div class="comment-pannel-left">
									<div class="user-face">
										<!-- <img :src="item.from?.avatar" /> -->
										<n-avatar
											:size="42"
											:src="
												item.from?.avatar ??
												'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
											"
											fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
											style="padding: 0; margin: 0; user-select: none; border: 1px solid #e4edf4"
											round
											lazy
											:intersection-observer-options="{
												root: '.room-container',
											}"
										/>
									</div>
									<div class="user-info">
										<strong class="user-name">
											{{ item.from?.username }}
										</strong>
										<div class="user-stats">
											粉丝:{{ roomState?.from.stats.fans }} 稿件:{{ roomState?.from.stats.rooms }}
										</div>
									</div>
								</div>
								<div class="comment-pannel-right">
									<div class="user-action">
										<n-dropdown
											placement="bottom-end"
											trigger="click"
											:show-arrow="true"
											size="large"
											:options="commentOptions"
											@select="(key:string)=>handleSelect(key,item)"
										>
											<n-button text style="font-size: 24px">
												<n-icon size="16px" color="#aaa" :component="EllipsisVertical"></n-icon>
											</n-button>
										</n-dropdown>
									</div>
								</div>
							</div>
						</div>
						<div class="comment-card__content">
							<div class="user-replyTo" v-if="item.replyTo">
								回复
								<a :href="`/user/${item.replyTo.from?.uid}`">{{ `@${item.replyTo.from?.username}` }}</a>
								{{ `#-${item.replyTo.floor}` }}
							</div>
							<tiptapEditor
								v-if="item.replyTo"
								theme="headless"
								:modelValue="`<blockquote>${item.replyTo.content}</blockquote>`"
							>
							</tiptapEditor>

							<tiptapEditor theme="headless" v-model="item.content"> </tiptapEditor>
						</div>
						<div class="comment-card__footer">
							<div class="time-area">
								{{ item.createdAt && format(item.createdAt!, 'yyyy-MM-dd HH:mm:ss') }}
							</div>
							<div class="floor-area">#-{{ item.floor }}</div>
						</div>
					</div>
					<div class="comment-empty" v-if="!commentState.total">没有更多评论</div>
				</template>
			</div>
			<div class="comment-container__footer">
				<div class="pagination" v-if="commentState?.total">
					<n-pagination
						v-model:page="query.page"
						:page-sizes="[query.size]"
						:page-count="pageCount"
						@update:page="handleChangePage"
						show-quick-jumper
						size="small"
					>
						<template #goto> 跳转 </template>
					</n-pagination>
				</div>
			</div>
		</div>
		<!-- 评论编辑区 -->
		<div class="comment-edit" ref="commentEditRef">
			<div class="comment-edit__header">
				<h2>快速回帖</h2>
			</div>
			<div class="comment-edit__content">
				<tiptapEditor
					v-if="userStore.userInfo"
					v-model="newComment.content"
					v-model:assets="newComment.assets"
					ref="tipTapRef"
				></tiptapEditor>
				<div class="unLogin" v-else>
					<div>请登陆后再回复</div>
					<n-button type="info" @click="handleLogin"> 登陆 </n-button>
				</div>
			</div>
			<div class="comment-edit__footer" v-if="userStore.userInfo">
				<div class="comment-edit__footer-left">
					<div class="quote-reply" v-if="quetoState">
						引用回复 @{{ quetoState?.from.username }} #-{{ quetoState?.floor }}
						<n-button text @click="handleResetQuote">
							<n-icon size="20px" color="#666" :component="CloseOutline"></n-icon>
						</n-button>
					</div>
				</div>
				<div class="comment-edit__footer-right">
					<n-button color="#233" v-debounce:click="handlePublishComment">发表评论</n-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, provide, reactive, ref, toRefs, watch, computed } from 'vue'
import { format } from 'date-fns'
import tiptapEditor, { DefineExpose } from '@/components/rich-editor/tiptapEditor.vue'
import { useRoomStore } from '@/store/room'
import { useUserStore } from '@/store/user'
import { Room } from '@/types/room'

import { CommentList, Comment, CommentParam } from '@/types/comment'
import { Query } from '@/types/common'

import { useCommentStore } from '@/store/comment'

import { Square, EllipsisVertical, CloseOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomStore()
const userStore = useUserStore()
console.log('route.params.id', route.params.id)

const tipTapRef = ref<DefineExpose | undefined>()
const quetoState = ref<Comment>()

const state = reactive<{
	roomState?: Room
	commentState?: CommentList
	newComment: CommentParam
	query: Query
}>({
	roomState: undefined,
	commentState: undefined,
	newComment: {},
	query: {
		page: route.query.page ? Number(route.query.page) : 1,
		size: 10,
	},
})
const { roomState, commentState, newComment, query } = toRefs(state) //template中使用

const pageCount = computed(() => {
	let totalPage = 1
	if (state.commentState) {
		const total = state.commentState.total
		const size = state.query.size!
		totalPage = Math.floor((total + size - 1) / size)
	}

	return totalPage
})
const commentOptions = [
	{
		label: '回复',
		key: 'reply',
	},
	{
		label: '删除',
		key: 'delete',
	},
]
const commentEditRef = ref<HTMLDivElement>()
const handleSelect = (key: string | number, data: Comment) => {
	if (key == 'reply') handleQuote(data)
	if (commentEditRef.value)
		commentEditRef.value.scrollIntoView({
			// top: dom.offsetTop - 20,
			behavior: 'smooth',
		})
}
//////////////////////////////////////////////////////////////////////////////////////////
const commentStore = useCommentStore()

const handlePublishComment = async () => {
	if (!state.roomState) {
		return
	}
	state.newComment.oid = state.roomState.hid
	if (quetoState.value) {
		state.newComment.replyTo = quetoState.value._id
	}

	const res = await commentStore.COMMENT_SET(state.newComment)
	const { code, data } = res.data
	if (code == 200) {
		router.go(0)
	}
}
const handleQuote = (data: any) => {
	quetoState.value = data
}
const handleResetQuote = () => {
	quetoState.value = undefined
}

///////////////////////////////////////////////////////////////////////////////////////////
const getCommentList = async (id: string, query: Query) => {
	window.$spin.add()
	const res = await commentStore.COMMENT_GET_LIST(id, query)
	const { code, data } = res.data
	if (code == 200) {
		state.commentState = data
		window.$spin.sub()
	}
}
const commentRef = ref<HTMLDivElement>()
const handleChangePage = (page: number) => {
	router.push({
		query: {
			page,
		},
	})

	getCommentList(route.params.id as string, state.query).then(() => {
		if (commentRef.value)
			commentRef.value.scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			})
	})
}
const handleEdit = () => {
	if (userStore.userInfo?.role !== 'root') {
		return window.$message.warning('没有权限')
	}
	router.push({
		path: `/creator/draw`,
		query: { id: route.params.id },
	})
}
const handleDel = async () => {
	const res = await roomStore.ROOM_DEL(state.roomState!.hid)
	const { code } = res.data
	if (code == 200) {
		router.push({
			path: `/room`,
		})
	}
}

const handleLogin = () => {
	router.push({
		path: '/auth/login',
	})
}

const getRoomDetail = async (id: string) => {
	window.$spin.add()
	const res = await roomStore.ROOM_GET(id)
	const { code, data } = res.data
	if (code == 200) {
		// roomState={...(res?.data)}
		// console.log(roomState);
		// title.value=data.title
		// Object.assign(roomState, data)
		state.roomState = data
		window.$spin.sub()

		// roomState.comment=[{
		//     from:'test',
		// }]
	}
}

onMounted(() => {})

watch(
	() => route.params.id,
	() => {
		if (route.params.id) {
			getRoomDetail(String(route.params.id))
			getCommentList(String(route.params.id), state.query)
		}
	},
	{ immediate: true }
)
</script>

<style lang="less" scoped>
// @import '@/views/root.less';

//主容器
.room-container {
	width: 100%;
	height: 100%;
	// min-height: calc(100vh - 50px);
	// display: flex;
	// flex-direction: column;
	background: #edf2f7;
	padding: 8px 0px 20px;
	position: relative;
	// margin: 0 auto;
}
.room-breadcrumb {
	font-size: 10px;
	margin: 0px auto 10px;
	padding: 5px 0px;
	border-radius: 12px;
	max-width: 960px;
	overflow: hidden;
	text-overflow: ellipsis;
	// background-color: #fff;
}
.divider {
	height: 1px;
	width: 100%;
	// background: hsla(0,0%,59.2%,.21);
	background: rgba(114, 114, 114, 0.3);
	margin: 12px 0px 20px;
}

//文章容器
.article-container {
	max-width: 960px;
	background-color: #fff;
	outline: 1px solid #e4edf4;
	border-radius: 12px;
	// -ms-flex-negative: 0;
	// flex-shrink: 0;
	padding: 30px 40px 40px;
	margin: 0px auto 20px;
}

.article-container__header {
	width: 100%;
	// display: flex;
	// justify-content: space-between;
}
.article-pannel {
	width: 100%;
	height: 60px;
	display: flex;
	justify-content: space-between;
}
.article-pannel-left {
	display: flex;
	.up-face {
		width: 58px;
		margin: 2px;
		img {
			width: 58px;
		}
	}
	.up-info {
		// display: flex;
		.up-name {
			font-size: 18px;
			line-height: 18px;
			color: #00965e;
		}
	}
	.up-stats {
		font-size: 12px;
		color: #999;
	}
}
.article-title {
	width: 100%;
	padding-left: 12px;
	margin-bottom: 20px;
	h1 {
		font-weight: 500;
	}
}
.article-stats {
	padding: 0 12px;
	font-size: 13px;
	display: flex;
	justify-content: end;
	gap: 24px;
	.time-area {
		color: #99a2aa;
	}
	.stats-area {
		color: #99a2aa;
	}
}
.article-container__content {
	width: 100%;
	margin: 0 auto;
	// padding: 5px 20px;
	// display: flex;
}
.edit-box {
	max-width: 900px;
}

//评论容器
.comment-container {
	max-width: 960px;
	background-color: #fff;
	outline: 1px solid #e4edf4;
	border-radius: 12px;
	-ms-flex-negative: 0;
	flex-shrink: 0;
	padding: 5px 40px 5px;
	margin: 0px auto 20px;
	// margin-bottom: 12px;
	scroll-margin-top: 60px;
}
.comment-container__header {
	margin: 5px 0px 20px;
	h2 {
		font-weight: 500;
	}
	// background-color: rgb(250, 250, 252);
}
// .comment-container__content {
// 	width: 100%;
// 	margin: 20px auto;
// 	padding: 5px 20px;
// 	// display: flex;
// }
.comment-container__footer {
	display: flex;
	justify-content: center;
	// align-items: center;
	margin: 12px 0px;

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.comment-empty {
	height: 50px;
	font-size: 16px;
	color: #999;
	text-align: center;
}
.comment-card {
	width: 100%; //计算自适应宽度防止文字溢出
	display: flex;
	flex-direction: column;
	padding: 20px 0 14px 0;
	border-bottom: #ccc 1px solid;
	// .view-box {
	// width: calc(100% - 50px); //计算自适应宽度防止文字溢出
	// }
}
.comment-card__header {
	width: 100%;
	margin-bottom: 5px;
}
.comment-pannel {
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}
.comment-pannel-left {
	display: flex;
	.user-face {
		width: 46px;
		margin: 2px;
		img {
			width: 46px;
			height: auto;
			// object-fit: cover; //这里让图片保持原始比例并填充整个容器
			// object-position: center; //这里让图片居中显示
		}
	}
	.user-info {
		// display: flex;
		.user-name {
			font-size: 15px;
			line-height: 15px;
			color: #00965e;
		}
	}
	.user-stats {
		font-size: 11px;
		color: #99a2aa;
	}
}
.comment-pannel-right {
	display: flex;
}
.comment-card__content {
	.user-replyTo {
		font-size: 12px;
		margin: 0px 28px;
		padding: 2px 20px;
		border: 2px solid rgba(#0d0d0d, 0.1);
		background-color: #eee;
		display: inline;
		a {
			outline: none;
			color: #00a1d6;
			text-decoration: none;
			cursor: pointer;
		}
	}
}
.comment-card__footer {
	display: flex;
	justify-content: space-between;
	font-size: 12px;
	.time-area {
		color: #99a2aa;
	}
	.floor-area {
		color: #99a2aa;
	}
}

//发表评论的富文本编辑器容器
.comment-edit {
	outline: 1px solid #e4edf4;
	border-radius: 12px;
	max-width: 960px;
	margin: 0px auto;
	padding: 25px 40px 25px;
	background-color: #fff;
}
.comment-edit__header {
	margin-bottom: 10px;
}
.comment-edit__content {
	width: 100%;
	// height: 100%;
	height: 240px;

	.unLogin {
		height: 250px;
		font-size: 18px;
		color: #99a2aa;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}
}

.comment-edit__footer {
	height: 30px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
	.quote-reply {
		border: 2px #000 solid;
		border-radius: 5px;
		padding: 3px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

@media screen and (max-width: 965px) {
	.comment-edit__content {
		height: 300px;
	}
}
@media screen and (max-width: 540px) {
	.article-container {
		padding: 20px 10px 30px;
	}
	.comment-container {
		padding: 5px 10px 5px;
	}
	.comment-edit {
		padding: 25px 10px 25px;
	}
	.comment-edit__content {
		height: 350px;
	}
}
</style>
