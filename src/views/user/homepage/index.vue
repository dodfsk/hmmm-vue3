<template>
	<div class="container">
		homepage 主页
        <h1>
        此处放了很多测试用的demo
        </h1>
		<n-input v-model:value="a"> </n-input>

		<!-- <img src="http://192.168.2.103:13573/api/assets/picture/hmlc/qemu-kvm.png"
    /> -->

		<n-upload
			:headers="{
				'naive-info': 'hello!',
			}"
			:data="{
				'naive-data': 'cool! naive!',
			}"
			:custom-request="customRequest"
		>
			<n-button disabled>上传文件至MINIO</n-button>
		</n-upload>
        clipper图片裁剪组件demo
        <input type="file" id="file" @change="getFile"/>

        <div id="clipper-container">

        </div>
        <n-button @click="getAlter">裁剪测试</n-button>

	</div>
</template>

<script setup lang="ts">
import { ref,nextTick } from 'vue';
import { useMinioStore } from '@/store/minio';
import { UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { ImgClipper } from '@/utils/img/imgClipper';

const a = ref<string>('a');
const minioStore = useMinioStore();
const message = useMessage();
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

	//   let reg_str =/^http:\/\/\d+\.\d+\.\d+\.\d+:\d+/
    const params= {
        bucketName: 'picture',
        fileName: file.name,
    }
	//   .replace(reg_str,import.meta.env.VITE_APP_OSS)
    const res=await minioStore.MINIO_GET_URL(params)
	const url = res.data.data.url;

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

let clipper:any
let file:File


const getFile=()=>{
    file = (document.querySelector('#file') as HTMLInputElement).files?.item(0)!;
    clipper=new ImgClipper(file,{
        container:'#clipper-container',
        cWidth:800,
        cHeight:400,
        fixed:1920/1080,
        iWidth:1280,
        iHeight:720,
    })
    console.log(clipper);
}
const getAlter=()=>{
    console.log(
        clipper.getAlter(),
        clipper.result
    );
}
</script>

<style lang="less" scoped>
.container {
	padding: 40px;
	// background-color:#ccc;
    // display:flex;
    // flex-direction: column;
    // align-items: center;
    overflow: auto;
}
// img{
//     width:400px;
//     height:400px;
// }
#clipper-container{
    margin:0 auto;
    display: flex;
    justify-content: center;
    // align-items: center;
    // box-sizing: content-box;
    border:1px solid #ccc;
    min-width:800px;
    min-height:400px;
    // padding:5px;
    // min-height:200px;
    overflow: hidden;
}

</style>
