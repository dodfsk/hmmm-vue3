<template>
	<div class="face-container">
		<div class="face-box">
			<div class="face-box__header">
				<n-divider title-placement="left" color="#333">
					<h2>头像</h2>
				</n-divider>
			</div>

			<div class="face-box__content">
				<n-space align="center" vertical>
					<n-avatar
						:size="168"
						:src="imgSrc"
						fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        style="border:1px solid #e4edf4;"
						round
					>
						<div v-if="!imgSrc">
							<n-icon size="80" :component="HappyOutline" />
						</div>
					</n-avatar>

					<n-button type="error" @click="showModal = true">选择</n-button>
					<n-button type="info" :disabled="!faceState.base64" v-debounce:click="handleUpload">上传</n-button>
				</n-space>
			</div>
		</div>

		<n-modal
			v-model:show="showModal"
			preset="card"
			size="small"
			title="Face Clipper Tool"
			style="width: 800px; min-height: 300px; -webkit-user-drag: none"
		>
			<FaceUploadModal ref="uploadModalRef"> </FaceUploadModal>
			<!-- @after-leave="handleCloseModal" -->
			<n-button primary v-debounce:click="handleModalOk" :style="{ float: 'right' }">确定</n-button>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
import { ref, provide, reactive, onMounted, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useMinioStore } from '@/store/minio'
import { User, UserParam } from '@/types/user'
import { fileToBase64 } from '@/utils/img/imgToBase64'
import { imgCompress } from '@/utils/img/imgCompress'
import FaceUploadModal from './components/FaceUploadModal.vue'
import type { Result } from '@/utils/img/imgClipper'
import { cloneDeep } from 'lodash-es'
import { HappyOutline } from '@vicons/ionicons5'

const userStore = useUserStore()
const minioStore = useMinioStore()
const message = useMessage()

const showModal = ref(false)
const uploadModalRef = ref()

const preSignInfo: {
	url?: string
	fileName?: string
} = {}

const modelRef = ref<UserParam>({})
const imgSrc = ref<string | undefined>(undefined)
const faceState = reactive<Result>({
	base64: '',
	file: null,
})

const handleUpload = async () => {
    window.$spin.add()
	// fileToBase64((file.file)as File,(base64:string)=>{
	//         console.log('压缩前',base64);
	//         modelRef.value.avatar=base64
	//     // imgCompress(base64,(res:string)=>{
	//     //     console.log('压缩后',res);
	//         // modelRef.value.avatar=res
	//         showModal.value=true
	// })
	preSignInfo.fileName = new Date().getTime() + faceState.file!.name+'.webp'
	// preSignInfo.fileName = 'avatar.png'

	const faceParams = {
		bucketName: 'face',
		subName: modelRef.value.uid!,
		fileName: preSignInfo.fileName,
	}

	//获取预签名url
	const url = await minioStore.MINIO_GET_URL(faceParams)
	if (url) preSignInfo.url = url.data.data.url
	//put方法直接上传file至预签名url
	const res = await minioStore.MINIO_PUT({
		url: preSignInfo.url,
		data: faceState.file,
		headers: {
			'Content-Type': faceState.file?.type,
		},
	})
	//上传成功回调
	if (res) {
		message.success('上传成功')
		handleUpdate()
        window.$spin.sub()
		faceState.base64 = ''
		faceState.file = null
	}
}

const handleModalOk = async () => {
	// console.log(uploadModalRef.value);
	if (uploadModalRef.value.isClipperReady) {
		const alter = await uploadModalRef.value.getAlterResult()
		console.log('alter,alter.file', alter, alter.file)
		if (alter) {
			// imgSrc.value = alter.base64
			Object.assign(faceState, alter)
			imgSrc.value = alter.base64
			showModal.value = false
		}
	} else {
		message.error('请先选择图片')
	}
}

const handleUpdate = async () => {
	modelRef.value.avatar = `@oss/face/${modelRef.value.uid}/${preSignInfo.fileName}`
	const res = await userStore.USER_SET(modelRef.value)
	const { code, message, meta, data } = res.data
	console.log('data,modelRef.value', data, modelRef.value)

	Object.assign(modelRef.value, data)

}

const getUserInfo = async () => {
	const res = await userStore.USER_GET_MY()
	if (!res) {
		return
	}
	const { code, message, meta, data } = res.data

	Object.assign(modelRef.value, data)
	imgSrc.value = data.avatar
}
onMounted(() => {
	getUserInfo()
})
</script>

<style lang="less" scoped>
// @import '@/views/root.less';
.face-container {
    width: 100%;
	height: 100%;
	padding: 20px;
	background-color: #e9ecef;
	// display: flex;
	// flex-direction: column;
	// align-items: center;
	overflow: auto;
}
.face-box {
	width: 100%;
	// width:fit-content;
	margin: auto;
	max-width: 960px;
	min-width: 560px;
	padding: 30px;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.321);
	display: flex;
	flex-direction: column;
	align-items: center;
}
// :deep(.n-card__content){
//     width:80%;
//     display:flex;
//     flex-direction: column;
//     align-items: center;
// }
.face-box__header {
	width: 100%;
	// min-width:500px;
	padding: 0 36px;
	display: flex;
	justify-content: center;
}
.face-box__content {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	// .avatar{
	//     width:200px;
	//     height:200px;
	//     object-fit: cover;//居中自动剪裁图片
	// }
}

.n-button {
	min-width: 90px;
}

img {
	width: 400px;
	height: 400px;
	object-fit: contain;
}
</style>
