<template>
    <n-modal
        class="modal-container"
        preset="card"
        size="small"
        title="Tiptap Oss Uploader"
        style="width:750px;min-height:300px;-webkit-user-drag: none;"
        :on-after-leave="()=>{isClipperReady=false,isImgReady=false}"
    >   

        <div id="clipper-container"
            v-show="isClipperReady"
        ></div>
        
        <n-space justify="center" align="center" v-if="isImgReady" style="width:700px;min-height:200px">
            <img :src="imgSrc" style="max-width:700px"/>
        </n-space>

        <n-upload
            v-if="!isClipperReady&&!isImgReady"
            multiple
            directory-dnd
            :default-upload="false"
            :max="1"
            @before-upload="putUploadFile"
        >
            <n-upload-dragger
                style="height:192px"
            >
            <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                <ArchiveOutline />
                </n-icon>
            </div>
            <n-text style="font-size: 16px">
                点击或者拖动图片到该区域来上传
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
            </n-p>
            </n-upload-dragger>
        </n-upload>
        
            <!-- @after-leave="handleCloseModal" -->
        <n-space justify="end">
            <n-button  type="primary"
                :disabled="!isClipperReady"
                v-debounce:click="handleUploadCut" 
                >剪裁上传</n-button>
            <n-button  type="info"   
                :disabled="!isClipperReady&&!isImgReady"
                v-debounce:click="handleUploadOri" 
            >原图上传</n-button>
        </n-space>
    </n-modal>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch,ref,Ref } from 'vue';
import { ImgClipper } from '@/utils/img/imgClipper';
import type {Result} from '@/utils/img/imgClipper'
import { ArchiveOutline } from '@vicons/ionicons5'
import { UploadFileInfo } from 'naive-ui';
import { useUserStore } from '@/store/user';
import { useMinioStore } from '@/store/minio';
import { PreSignInfo } from '@/types/room';
import { fileToBase64 } from '@/utils/img/imgToBase64';
import { useRoute } from 'vue-router';
import { getToken, TOKEN_PREFIX } from '@/utils/common/auth';

export type DefineExpose = {
// cropper: InstanceType<typeof Cropper>;
    isClipperReady:Ref<boolean>,
    getOriginalFile:Function,
};

// type Props = {
// 	showModal?: string;
// };
type Emits = {
	(e: 'handleUploadDone', value: PreSignInfo): void;
};

// const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// let result:object={}
// let imgResize:any

const route = useRoute();
const userStore = useUserStore();
const minioStore=useMinioStore()

const clipper=ref<any>()
const isClipperReady=ref<boolean>(false)
const isImgReady=ref<boolean>(false)
const imgSrc=ref<string>('')

let result:Result={
    base64:'',
    file:null,
}
const originalFile=ref<UploadFileInfo>()
const preSignInfo:PreSignInfo={
    url:'',
    fileName:''
}

// nextTick(()=>{
//         handleCenter()
// })

onMounted(() => {
    isClipperReady.value=false
});

const putUploadFile=async ({file}: {
      file: UploadFileInfo
    })=>{
    console.log('UploadFileInfo',file);

    originalFile.value=file
    const mimeType=file.type
    console.log(mimeType,file.name);
    
    if (mimeType === 'image/png'||mimeType==='image/jpeg') {
        isClipperReady.value=true
        //实例化图片裁剪组件
        clipper.value=new ImgClipper(file.file!,{
            container:'#clipper-container',
            cWidth:400,
            cHeight:400,
            // pre:'#pre-container',
            // pWidth:200,
            // pHeight:200,
            // fixed:1,
            // outputWidth:300,
            // outputHeight:300,
        })
        console.log(clipper);
        return true
    }else if(mimeType === 'image/gif'){
        isImgReady.value=true
        // const reader = new FileReader();
        //     reader.readAsDataURL(originalFile.value.file as any);
        //     reader.onload = () => {
        //     imgSrc.value = reader.result as string;
        //     // 这里的reader.result就是文件的base64了。如果是图片的话，就可以直接放到src中展示了
        // };
        fileToBase64(originalFile.value.file!,(base64:string)=>{
            imgSrc.value=base64
        })
        return true
    }else{
        window.$message.error('只能上传png/jpg格式的图片文件，请重新选择')
        return false
    }
    
}


const getOriginalFile=async ()=>{
    return originalFile.value
}

const handleUploadCut=async ()=>{
    // console.log(uploadModalRef.value);
    
    if(isClipperReady.value){
        result=await clipper.value.getAlterResult()
        if(result){
            // imgSrc.value=alter.base64
            // Object.assign(faceState,alter)
            // modelRef.value.avatar=alter.base64
            // showModal.value=false
            handleUpload('cut')
        }
    }
}
const handleUploadOri=()=>{
    handleUpload('original')
}

const handleUpload=async (type:string)=>{
    window.$spin.add()
    // fileToBase64((file.file)as File,(base64:string)=>{
    //         console.log('压缩前',base64);
    //         modelRef.value.avatar=base64
    //     // imgCompress(base64,(res:string)=>{
    //     //     console.log('压缩后',res);
    //         // modelRef.value.avatar=res
    //         showModal.value=true
    // })
    
    //文件名为图片原始文件名
    // preSignInfo.fileName=originalFile.value!.name
    //文件名为图片原始文件名+时间戳
    // preSignInfo.fileName=new Date().getTime()+originalFile.value!.name+(originalFile.value?.type === 'image/gif'?'.webp':'')
	preSignInfo.fileName = originalFile.value!.name + '_' + new Date().getTime() + (originalFile.value?.type === 'image/gif'?'.gif':'.webp')


    const fileParams={
        bucketName:'archive',
        subName:String(route.query.id)??route.params.id,
        fileName:preSignInfo.fileName,
    }
    
    //获取预签名url
    const url=await minioStore.MINIO_GET_URL(fileParams)
    if(url.status===200)preSignInfo.url=url.data.data.url
    // if(url.status===200)preSignInfo.url=url.data.data.postURL
    // //put方法直接上传file至预签名url

	// let test:Object={...url.data.data.formData}
    // console.log(test)
    const file=type==='original'?originalFile.value!.file : result.file
    
    // const formData = new FormData();
    // Object.entries(test).forEach(([k, v]) => {
    //         formData.append(k, v);
    // });
    // formData.append('test', 'xxxxxxxxxxxxxxxxxxxx');

    // formData.append('file', file as Blob);

    const res=await minioStore.MINIO_PUT({
        url:preSignInfo.url,
        data: file,
        // data: formData,
        headers: {
            'Content-Type': result.file?.type,
            'Access-Control-Allow-Origin':'*', // 允许跨域
        },
    })
    //上传成功回调
    if(res.status===200){
        // message.success('上传成功')
        // handleUpdate()            
        // loading.value=false
        // result.base64=''
        // result.file=null
        preSignInfo.url=preSignInfo.url!.split('?X-Amz-Algorithm')[0]
        emits('handleUploadDone',preSignInfo)
        window.$spin.sub()
    }

}

defineExpose<DefineExpose>({
    isClipperReady,
    getOriginalFile,
});
</script>

<style lang="less" scoped>
.modal-container{
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // border:1px solid #000;
    // border-radius:.375rem;
    height: 100%;
    padding:10px;

}
// img{
//     max-width: 700px;
//     max-height: 200px;
// }

#clipper-container{
    margin:0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    // // box-sizing: content-box;
    // border:1px solid #ccc;
    // // padding:5px;
    // min-height:200px;
    // overflow: hidden;
}

// #pre-container{
//     margin:0 auto;
// }
</style>
