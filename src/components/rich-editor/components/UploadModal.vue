<template>
    <n-modal
        class="modal-container"
        preset="card"
        title="Tiptap Oss Uploader"
        size="small"
        style="width:750px;min-height:300px;-webkit-user-drag: none;"
        :bordered="false"
        :block-scroll="true"
        display-directive="if"
        :on-after-leave="()=>{isClipperReady=false,isImgReady=false}"
    >   

        <div id="clipper-container"
            v-show="isClipperReady"
        ></div>
        <n-space justify="center" align="center" v-if="isImgReady" style="min-height:200px">
            <n-image :src="imgSrc" />
        </n-space>

        <n-upload
            v-if="!isClipperReady&&!isImgReady"
            multiple
            directory-dnd
            :default-upload="false"
            :max="1"
            @before-upload="putFile"
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
                @click="handleUploadCut" 
                >剪裁上传</n-button>
            <n-button  type="info"   
                :disabled="!isClipperReady&&!isImgReady"
                @click="handleUploadOri" 
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

export type DefineExpose = {
// cropper: InstanceType<typeof Cropper>;
    isClipperReady:Ref<boolean>,
    getOriginalFile:Function,
};
export type PreSignInfo={
    url:string,
    fileName:string
}

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

const putFile=async ({file}: {
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
            cWidth:750,
            cHeight:400,
            // fixed:1,
            // iWidth:300,
            // iHeight:300,
        })
        console.log(clipper);
        return true
    }else if(mimeType === 'image/gif'){
        isImgReady.value=true
        const reader = new FileReader();
            reader.readAsDataURL(originalFile.value.file as any);
            reader.onload = () => {
            imgSrc.value = reader.result as string;
            // 这里的reader.result就是文件的base64了。如果是图片的话，就可以直接放到src中展示了
        };
        return true
    }else{
        window.$message.error('只能上传png/jpg格式的图片文件，请重新上传')
        return false
    }
    
}


const getOriginalFile=async ()=>{
    return originalFile.value
}

const handleUploadCut=async ()=>{
    // console.log(uploadModalRef.value);
    
    if(isClipperReady.value){
        result=await clipper.value.getAlter()
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
    // fileToBase64((file.file)as File,(base64:string)=>{
    //         console.log('压缩前',base64);
    //         modelRef.value.avatar=base64
    //     // imgCompress(base64,(res:string)=>{
    //     //     console.log('压缩后',res);
    //         // modelRef.value.avatar=res
    //         showModal.value=true
    // })
    
    //文件名为图片原始文件名
    preSignInfo.fileName=originalFile.value!.name

    const params={
        bucketName:'picture',
        fileName:preSignInfo.fileName,
    }
    //获取预签名url
    const url=await minioStore.MINIO_GET_URL(params)
    if(url.status===200)preSignInfo.url=url.data.data.url
    //put方法直接上传file至预签名url
    const res=await minioStore.MINIO_PUT({
        url:preSignInfo.url,
        data: type==='original'?originalFile.value!.file : result.file,
        headers: {
            'Content-Type': result.file?.type
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
    // box-sizing: content-box;
    border:1px solid #ccc;
    // padding:5px;
    min-height:200px;
    overflow: hidden;
}
</style>
