<template>
	<div class="container">
        <div class="card">

        <div class="header">
            <div class="header-left">
                <h2>我的头像</h2>
                <hr>
            </div>
            <n-button type="primary" @click="handleUpdate"> 保 存</n-button>

        </div>

        <div class="content">

            <n-space vertical>
                
                <n-avatar
                     :size="120"
                    :src="modelRef.avatar"
                    object-fit="cover"
                    lazy
                    round
                />

                <n-upload
                    @before-upload="beforeUpload"
                >
                    <!-- list-type="image-card" -->
                    <!-- :custom-request="customRequest" -->
                    <n-button type="info">上传</n-button>
                </n-upload>

                <n-button type="error" @click="showModal=true">打开</n-button>

            </n-space>


        </div>

        </div>

        <n-modal
            v-model:show="showModal"
            preset="card"
            title="视窗模式"
            size="small"
            style="width:900px;min-height:600px;"
            :bordered="false"
            :block-scroll="true"
            :segmented="{
                content: 'soft',
                footer: 'soft'
            }"
        >   
            <uploadModal
                ref="modalRef"
                :src="modelRef.avatar"
            >
            </uploadModal>
            <!-- @after-leave="handleCloseModal" -->
        </n-modal>
	</div>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive, onMounted, computed } from 'vue';
import { FormInst, FormItemInst, FormItemRule, FormRules, NIcon, UploadCustomRequestOptions, UploadFileInfo, useMessage } from 'naive-ui';
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5';
import { demoPiniaOptions, demoPiniaComposition } from '@/store/demo';
import { useUserStore } from '@/store/user';
import {useMinioStore} from '@/store/minio';
import { RouterLink } from 'vue-router';
import { User } from '@/types/user';
import { OssReplace } from '@/utils/img/imgReplace';
import { fileToBase64 } from '@/utils/img/imgToBase64';
import { imgCompress } from '@/utils/img/imgCompress';
import uploadModal from './uploadModal.vue';

const inverted = ref(true);

let hmlc_info = ref();
const userStore = useUserStore();
const minioStore=useMinioStore()
const message = useMessage();

const loading=ref(true)
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const modelRef = ref<User>({});
const imgSrc=ref<string>('')
const showModal=ref(false)
const modalRef=ref()

const avatarObject:{
    url?:string,
    fileName?:string
}={}

const beforeUpload=async (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
    })=>{
    const mimeType=data.file.file?.type
    console.log(mimeType,data.file.file?.name);
    
    if (mimeType !== 'image/png'&&mimeType!='image/jpeg') {
        message.error('只能上传png/jpg格式的图片文件，请重新上传')
        return false
    }

    fileToBase64((data.file.file)as File,(base64:string)=>{
            console.log('压缩前',base64);
            modelRef.value.avatar=base64
        // imgCompress(base64,(res:string)=>{
        //     console.log('压缩后',res);
            // modelRef.value.avatar=res
            showModal.value=true
        // })
        
    })

    // avatarObject.fileName=`avatar.${data.file.file?.name.split('.').pop()?.toLocaleLowerCase()}`
    // console.log(data.file);

    // const params={
    //     bucketName:'picture',
    //     fileName:avatarObject.fileName,
    // }
    // const res=await minioStore.MINIO_GET_URL(params)
    // if(res)avatarObject.url=res.data.data.url
    
    return true
}

const customRequest=async ({file,onFinish}:UploadCustomRequestOptions)=>{
    const res=await minioStore.MINIO_PUT({
            url:avatarObject.url,
            data:file.file,
            headers: {
                'Content-Type': file.file?.type
            },
        })
        if(res){
            message.success('上传成功')
            modelRef.value.avatar=`oss/picture/${modelRef.value.username}/${avatarObject.fileName}`
            // imgSrc.value=file.file
            handleUpdate()            
                loading.value=false
            onFinish()
        }

}

const handleUpdate=async ()=>{
	const res = await userStore.USER_SET(modelRef.value)
	const { code, message, meta, data = {} } = res.data
}


const getUserInfo = async () => {
	const res = await userStore.USER_GET(userStore.userInfo.username!)
    if(!res){
        return
    }
	const { code, message, meta, data = {} } = res.data
	hmlc_info.value = data
    if(data.birth){
        data.birth=new Date(data.birth)
    }
    if(data.avatar){
        imgSrc.value=OssReplace(data.avatar)
    }
	Object.assign(modelRef.value, data)
};
onMounted(() => {
	getUserInfo();
});

</script>

<style lang="less" scoped>
// @import '@/views/root.less';
.container{
    padding: 40px;
    background-color:#ccc;
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}
.card{
    width:70%;
    // width:fit-content;
    max-width:1000px;
    min-width:500px;
    padding: 30px;
    background-color: #fff;
    border-radius: 3px;
	box-shadow: 0 0 10px rgba(51, 51, 51, 0.721);
    display:flex;
    flex-direction: column;
    align-items: center;
}
// :deep(.n-card__content){
//     width:80%;
//     display:flex;
//     flex-direction: column;
//     align-items: center;
// }
.header{
    width:80%;
    // min-width:500px;
    display:flex;
    justify-content: center;
    &-left{
        width:70%;
        text-align: left;
        hr{
            width:50%;
            min-width:286px; 
            color:"#ccc";
        }
    }
}
.content{
    width:80%;
    padding-top:20px;
    display:flex;
    justify-content: center;
    flex-wrap: wrap;

    // .avatar{
    //     width:200px;
    //     height:200px;
    //     object-fit: cover;//居中自动剪裁图片
    // }
}

.n-button {
    min-width:90px;
}

img{
    width:400px;
    height:400px;
    object-fit:contain;
}

</style>
