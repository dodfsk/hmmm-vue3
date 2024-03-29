<template>
	<div class="draw-container">
		<div class="draw-pre" v-if="!route.query.id">
			<n-card
				class="content"
				:style="{
					maxWidth: '480px',
					minWidth: '360px',
					margin: 'auto',
				}"
			>
				<template #header>
					<div>设置房间模板</div>
				</template>
				<div
					class="form-box"
					:style="{
						height: '80px',
					}"
				>
					<n-form ref="formRef" :label-width="80" label-placement="left" :model="roomState" size="small">
						<!-- :rules="rules" -->

						<n-form-item label="类型" path="selectValue">
							<n-select
								v-model:value="roomType"
								placeholder="请选择类型"
								:options="roomTypeOptions"
								style="user-select: none"
							>
								<template #action> 目前只做了文本，点击下一步将创建草稿 </template>
							</n-select>
						</n-form-item>
					</n-form>
				</div>
				<template #footer>
					<n-button type="primary" style="float: right" v-debounce:click="handleDraft">下一步</n-button>
				</template>
			</n-card>
		</div>
		<div class="draw-box" v-if="route.query.id && roomState">
			<div class="draw-box__header">
				
				<div style="display: flex;justify-content: space-between; flex-wrap: wrap;">
                    <div style="text-align: left;font-weight: 200;font-size: 56px;">#绘制房间</div>

                    <div class=draw-cover>
                        <n-image :src="roomState.cover??'/src/assets/image/tomato.webp'" height="100" class="draw-cover-img"/>
                        <n-button color="#666" v-debounce:click="handleCover" style="outline: 1px solid #000;height: 100px;"> 上传封面</n-button>
                    </div>
				</div>

				<div class="draw-form">
					<n-input-group class="input-group" style="height:40px">
						<n-input
							placeholder="标题"
							v-model:value="roomState.title"
							class="title"
							style="font-size: 18px;line-height:40px"
						/>
						<n-input
							placeholder="简介"
							v-model:value="roomState.desc"
							:class="animationFlag ? 'description-enabled' : 'description'"
							style="border-radius: 0;line-height:40px;border-left: 2px solid #000;"
						/>
						<!-- @animationend="animationFlag=false" -->
					</n-input-group>

					<div style="outline: 2px solid #000; border-radius: 0 5px 5px 0; ">
						<n-button color="black" @click="handleAnimation" style="height:40px">添加简介</n-button>
					</div>
				</div>
			</div>

			<div class="draw-box__content">
				<tiptapEditor
					ref="tipTapRef"
					v-model="roomState.content"
					v-model:assets="roomState.assets"
					@handleSaveAssets="handleSaveAssets"
				/>
			</div>
			<div class="draw-box__footer">
				<n-space justify="end">
					<n-button type="info" v-debounce:click="handleSave" v-if="!roomState.status">保 存</n-button>
					<n-button type="warning" v-debounce:click="handleUpdate" v-if="roomState.status">提 交</n-button>
					<n-button type="primary" v-debounce:click="handlePublish" v-if="!roomState.status">
						发 布
					</n-button>
				</n-space>
			</div>
		</div>
	</div>
	<CoverUploadModal
		v-model:show="showModal"
		ref="uploadModalRef"
		@handleUploadDone="handleSaveCover"
	></CoverUploadModal>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref, toRefs, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import tiptapEditor, { DefineExpose } from '@/components/rich-editor/tiptapEditor.vue'
import { PreSignInfo, Room } from '@/types/room'
import { useRoomStore } from '@/store/room'
import { useMinioStore } from '@/store/minio'
import { UploadFileInfo } from 'naive-ui'
import CoverUploadModal from './components/CoverUploadModal.vue'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomStore()
const minioStore = useMinioStore()

const showModal = ref<boolean>(false)

const tipTapRef = ref<DefineExpose | undefined>()

const animationFlag = ref(false)

const roomType = ref<string>('文本')
// const roomTypeFlag=ref<boolean>(false)
const roomTypeOptions = ['文本', '视频', '音乐'].map((v) => ({
	label: v,
	value: v,
	disabled: v !== '文本' ? true : false,
}))

const state = reactive<{
	roomState: Room | undefined
}>({
	roomState: undefined,
})
const { roomState } = toRefs(state) //template中使用

const originalFile = ref<UploadFileInfo>()
const preSignInfo: PreSignInfo = {
	url: '',
	fileName: '',
}

onMounted(() => {})

const handleSaveCover = async (preSign: PreSignInfo) => {
	window.$spin.add()
	if (state.roomState) {
		state.roomState.cover = preSign.url
		const params = {
			hid: state.roomState.hid,
			cover: state.roomState.cover,
		}
		console.log('save-params', params)
		const res = await roomStore.ROOM_PUT(params)
		const { code } = res.data
		if (code == 200) {
			window.$message.success('封面已更新')
			window.$spin.sub()
		}
	}
	showModal.value = false
}

const handleDraft = async () => {
	const params: Partial<Room> = {
		title: ` 预创建草稿-于${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
		content: '',
	}
	const res = await roomStore.ROOM_SET(params)
	const { code, data } = res.data
	if (code == 200) {
		router.push({
			path: `/creator/draw`,
			query: {
				id: data.hid,
			},
		})
		window.$message.success('创建草稿成功')
	}
}

const handleSave = async () => {
	console.log('roomState.assets', state.roomState)
	if (!state.roomState) {
		return
	}
	if (state.roomState.content) {
		console.log('roomState.content', state.roomState.content)
		const res = await roomStore.ROOM_PUT(state.roomState)
		const { code, data } = res.data
		if (code == 200) {
			window.$message.success('保存成功')
		}
	}
}

const handleSaveAssets = async () => {
	if (state.roomState) {
		const params = {
			hid: state.roomState.hid,
			assets: state.roomState.assets,
		}
		console.log('save-params', params)
		const res = await roomStore.ROOM_PUT(params)
		const { code, data } = res.data
		if (code == 200) {
			window.$message.success('附件信息已更新')
		}
	}
}

const handleUpdate = async () => {
	await handleSave()
	router.push({
		path: `/room/${state.roomState?.hid}`,
	})
}

const handlePublish = async () => {
	if (state.roomState) {
		handleSave()
		const params = {
			status: 2,
		}
		const res = await roomStore.ROOM_UPD_STATUS(state.roomState.hid, params)
		const { code, data } = res.data
		if (code == 200) {
			router.push({
				path: `/room/${data.hid}`,
			})
			window.$message.success('发布成功,现在所有人可见')
		}
	} else {
		window.$message.warning('公开发布之前请先写点什么吧！')
	}
}

const handleAnimation = () => {
	animationFlag.value = !animationFlag.value
}
const handleCover = async () => {
	showModal.value = true

	// //文件名为图片原始文件名
	// // preSignInfo.fileName=originalFile.value!.name
	// //文件名为图片原始文件名+时间戳
	// preSignInfo.fileName=originalFile.value!.name+new Date().getTime()

	// const params={
	//     bucketName:'picture',
	//     fileName:route.query.id+'/'+preSignInfo.fileName,//追加帖子名
	// }
	// //获取预签名url
	// const url=await minioStore.MINIO_GET_URL(params)
	// if(url.status===200)preSignInfo.url=url.data.data.url
	// //put方法直接上传file至预签名url

	// const res=await minioStore.MINIO_PUT({
	//     // url:preSignInfo.url,
	//     // data: type==='original'?originalFile.value!.file : result.file,
	//     // headers: {
	//     //     'Content-Type': result.file?.type,
	//     //     'Access-Control-Allow-Origin':'*', // 允许跨域
	//     // },
	// })
	// //上传成功回调
	// if(res.status===200){
	//     // message.success('上传成功')
	//     // handleUpdate()
	//     // result.base64=''
	//     // result.file=null
	//     // preSignInfo.url=preSignInfo.url!.split('?X-Amz-Algorithm')[0]
	//     // emits('handleUploadDone',preSignInfo)
	// }
}

const getRoomDetail = async (id: string) => {
	window.$spin.add()
	const res = await roomStore.ROOM_GET(id)
	const { code, data } = res.data
	if (code == 200) {
		// roomState={...(res?.data)}
		// console.log(roomState);
		// Object.assign(roomState, data);
		state.roomState = data
		// tipTapRef.value!.editorRef.editor.commands.setContent(roomState.content)
		window.$spin.sub()
	}
}

watch(
	() => route.query.id,
	() => {
		if (route.query.id) {
			getRoomDetail(route.query.id as string)
		} else {
			Object.assign(roomState, {
				hid: undefined,
				title: '',
				description: '',
				content: '',
				assets: [],
			})
		}
	},
	{ immediate: true }
)

//调试用watch
// watch(
// 	() => roomState.content,
// 	() => {
// 		console.log('content', roomState.content);
// 	}
// 	// { immediate:true,deep:true}
// );
</script>

<style lang="less" scoped>
@import '@/utils/less/animation.less';

.draw-container {
	width: 100%;
	height: 100%;
	// background: #e9ecef;
	// padding-top:20px;
	display: flex;
	flex-direction: column;
	// justify-content: center;
	// align-items: center;
	// overflow: auto;
}
.draw-pre {
	width: 100%;
	margin: auto;
}
.draw-box {
	flex: 1;
	width: 100%;
	max-width: 960px;
	margin: 0 auto;
	padding: 30px;
	background-color: #fff;
	// border-radius: 8px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.321);
}
.draw-box__header {
	width: 100%;
	margin-bottom: 20px;
    .draw-cover{
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .draw-cover-img{
            outline: 1px solid #000;
        }
    }
	.draw-form {
		display: flex;
		justify-content: space-between;
	    border-radius: 4px;
        outline: 2px solid #000;
		// .title{
		//     // min-width:20px;
		// //    width: 800px;1
		// //    width:100%;
		// }
		.description {
			display: none;
			width: 0px;
		}
		.description-enabled {
			animation: widthChange 0.9s ease-out;
		}
		.keyframes (all,widthChange,{
        from {width:0px;}
        to {width:100%;}
    });;
	}
}
.draw-box__content {
	width: 100%;
	// flex:0 0 240px;
	// min-height: 240px;
	// max-width: 960px;
	// border: 1px solid #888;
	// border-radius: 7px 0 0 7px;
}
.draw-box__footer {
	margin-top: 10px;
    .n-button {
        width: 90px;
    }
}


:deep(.ProseMirror) {
	min-height: 450px;
}
//粘性布局浮顶
:deep(.editor__header) {
	position: sticky;
	top: 0px;
	z-index: 1000;
}
</style>
