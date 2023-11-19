<template>
	<div class="modal-container">
		<div id="clipper-container" v-show="isClipperReady"></div>
		<n-avatar
			id="pre-container"
			v-show="isClipperReady"
			:size="38"
			fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
			style="padding: 0; margin: 0; user-select: none"
			round
		>
		</n-avatar>
		<!-- <div id="pre-container"
            v-show="isClipperReady"
        >
        </div> -->

		<n-upload
			v-show="!isClipperReady"
			multiple
			directory-dnd
			:default-upload="false"
			:max="1"
			@before-upload="putFile"
		>
			<n-upload-dragger>
				<div style="margin-bottom: 12px">
					<n-icon size="48" :depth="3">
						<ArchiveOutline />
					</n-icon>
				</div>
				<n-text style="font-size: 16px"> 点击或者拖动图片到该区域来上传 </n-text>
				<n-p depth="3" style="margin: 8px 0 0 0">
					请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
				</n-p>
			</n-upload-dragger>
		</n-upload>
	</div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch, ref, inject, Ref } from 'vue'
import { ImgClipper } from '@/utils/img/imgClipper'
import { ArchiveOutline } from '@vicons/ionicons5'
import { UploadFileInfo } from 'naive-ui'

export type DefineExpose = {
	// cropper: InstanceType<typeof Cropper>;
	isClipperReady: Ref<boolean>
	getAlterResult: Function
	getFile: Function
}
// type Props = {
// 	src?: string;
// };
type Emits = {
	(e: 'update:content', value: string): void
}

// const props = defineProps<Props>();
const emits = defineEmits<Emits>()
// let result:object={}
// let imgResize:any
// const image = new Image();
// // image.src = 'http://192.168.2.103:9000/picture/hmlc/test.png';
// image.src = props.src!;
// image.alt = 'Picture';

let clipper = ref<any>()
let isClipperReady = ref<boolean>(false)

// nextTick(()=>{
//         handleCenter()
// })

onMounted(() => {})

const putFile = async ({ file }: { file: UploadFileInfo }) => {
	console.log(file)
	const mimeType = file.file?.type
	console.log(mimeType, file.file?.name)

	if (mimeType !== 'image/png' && mimeType != 'image/jpeg') {
		window.$message.error('只能上传png/jpg格式的图片文件，请重新上传')
		return false
	}
	isClipperReady.value = true
	//实例化图片裁剪组件
	clipper.value = new ImgClipper(file.file!, {
		container: '#clipper-container',
		cWidth: 300,
		cHeight: 300,
		pre: '#pre-container',
		pWidth: 300,
		pHeight: 300,
		fixed: 1,
		outputWidth: 300,
		outputHeight: 300,
	})
	console.log(clipper)
	return true
}

const getAlterResult = async () => {
	const res = await clipper.value.getAlterResult()
	return res
}
const getFile = async () => {
	const result = await clipper.value.getFile()
	return result
}

defineExpose<DefineExpose>({
	isClipperReady,
	getAlterResult,
	getFile,
})
</script>

<style lang="less" scoped>
.modal-container {
	display: flex;
	justify-content: space-around;
	// align-items: center;
	// border:1px solid #000;
	// border-radius:.375rem;
	height: 100%;
	padding: 10px;
}
// img{
//     max-width: 700px;
//     max-height: 200px;
// }

// #clipper-container {
// 	// margin:0 auto;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// }
// #pre-container {
// 	margin: 0 auto;
// 	// display: flex;
// 	// justify-content: center;
// 	// align-items: center;
// 	// overflow: hidden;
// }
</style>
