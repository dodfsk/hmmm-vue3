<template>
	<div class="container">
		homepage 主页
		<n-input v-model:value="a"> </n-input>

		<!-- <img src="http://192.168.2.103:13573/api/assest/picture/hmlc/qemu-kvm.png"
    /> -->

		<n-upload
			:action="uploadUrl"
			:headers="{
				'naive-info': 'hello!',
			}"
			:data="{
				'naive-data': 'cool! naive!',
			}"
			:custom-request="customRequest"
		>
			<n-button>上传文件</n-button>
		</n-upload>

            <input type="file" id="file"  @change="handleCut"/>
            <br />
           
            <demo
                :preW = "90"
                :preH = "90"
                :whRatio = "1"
                :isAvatar = "true"
                :showPreview = "true"
                :customCutBtn = "true"
                :cutBoxW = "180"
                :cutBoxH = "200"
                :customUploadBtn = "false"
                :imgMaxSize = "4096"
            >
                    
            <img id="tImg"/>
            <img id="pImg"/>
            <div id="cFrame"></div></demo>
		<!-- <n-skeleton style="height:10000px;background-color: blueviolet;" />
     -->
	</div>
</template>

<script setup lang="ts">
import { ref,nextTick } from 'vue';
import { useMinioStore } from '@/store/minio';
import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
import request from '@/utils/axios/index';
import axios from 'axios';

const a = ref<string>('a');
const minioStore = useMinioStore();
const message = useMessage();
const uploadUrl = ref(`/upload/getUrl`);
const filesUrl=ref()

const handleUpload = async () => {
	const param = {
		bucketName: 'picture',
		// objectName:'记事本.conf'
		objectName: 'qemu-kvm.png',
	};
	const res = await minioStore.MINIO_GET(param);
	// .then(res=>res.data.arrayBuffer())
	// const blob=new Blob([res as any])
	console.log(res.data);
	const abuf = Buffer.from(res.data);
	const buf = abuf.buffer;
	console.log(abuf, buf);

	// const length=res.data.data.length
	// const buffer=new ArrayBuffer(length)
	// const view=new Uint8Array(buffer)
	// for(let i=0;i<length;i++){
	//     view[i]=res.data.data[i]
	// }
	// console.log(buffer);
	// const blob=new Blob([buffer])
	// console.log(blob);
	const Url = URL.createObjectURL(res.data as any);
	const a = document.createElement('a');
	a.href = Url;
	a.download = param.objectName;
	a.click();
};

const customRequest = async ({
	file,
	data,
	headers,
	withCredentials,
	action,
	onFinish,
	onError,
	onProgress,
}: UploadCustomRequestOptions) => {
	const formData = new FormData();
	//   if (data) {
	//     Object.keys(data).forEach((key) => {
	//       formData.append(
	//         key,
	//         data[key as keyof UploadCustomRequestOptions['data']]
	//       )
	//     })
	//   }
	formData.append('file', file.file as File);
	const res = await request({
		url: uploadUrl.value,
		method: 'post',
		data: {
			bucketName: 'picture',
			fileName: file.name,
		},
	});
	//   let reg_str =/^http:\/\/\d+\.\d+\.\d+\.\d+:\d+/
	const url = res.data.data.url;
	//   .replace(reg_str,import.meta.env.VITE_APP_OSS)

	console.log(file, formData);

	const result = await minioStore.MINIO_PUT({
		url,
		data: file.file,
		headers: {
			'Content-Type': file.file?.type,
		},
	});
	if (result) {
		message.success('上传成功');
		onFinish();
	}
};
const props={
            originW: 0,
            originH: 0,
            preW: 0,
            preH: 0,
            whRatio: 0,
            isAvatar: false,
            files: {
            minSize: 0,
            maxSize: 0,
            minW: 0,
            minH: 0,
        }
    }
const handleCut=()=>{
    const file=document.querySelector('#file') as HTMLInputElement
    const {files}=file
    if(!files?.length){
        return
    }
    let reader = new FileReader();
    reader.readAsDataURL(files[0])
    filesUrl.value=reader.result
    // const cutimg=new CutImg()
    // cutimg.selected(files[0])
    // cutimg.setId('tImg','pImg','cFrame')
    // console.log(cutimg,file.files);
    
}

</script>

<style lang="less" scoped>
.container {
	padding: 40px;
	// display:flex;
	// flex-direction: column;
	// align-items: center;
}
// img{
//     width:400px;
//     height:400px;
// }
</style>
