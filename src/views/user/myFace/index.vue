<template>
	<div class="container">
        <div class="card">

        <div class="header">
            <div class="header-left">
                <h2>我的头像</h2>
                <hr>
            </div>
            <!-- <n-button type="primary" @click="handleUpdate"> 保 存</n-button> -->

        </div>

        <div class="content">

            <n-space align="center" vertical>
                
                <n-avatar
                    :size="120"
                    :src="imgSrc"
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                    object-fit="cover"
                    lazy
                    round
                />

                <n-button type="error" @click="showModal=true">打开</n-button>
                <n-button type="info" :disabled="!faceState.base64" @click="handleUpload">上传</n-button>

            </n-space>


        </div>

        </div>

        <n-modal
            v-model:show="showModal"
            preset="card"
            title="Clipper Tool"
            size="small"
            style="width:800px;min-height:300px;-webkit-user-drag: none;"
            :bordered="false"
            :block-scroll="true"
        >   

            <uploadModal
                ref="uploadModalRef"
            >
            </uploadModal>
            <!-- @after-leave="handleCloseModal" -->
            <n-button  @click="handleModalOk" :style="{float:'right'}">确定</n-button>
        </n-modal>
	</div>
</template>

<script lang="ts" setup>
import { ref,provide, reactive, onMounted, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/store/user';
import {useMinioStore} from '@/store/minio';
import { User } from '@/types/user';
import { fileToBase64 } from '@/utils/img/imgToBase64';
import { imgCompress } from '@/utils/img/imgCompress';
import uploadModal from './uploadModal.vue';
import type {Result} from '@/utils/img/imgClipper'
import {cloneDeep} from 'lodash-es'

const userStore = useUserStore();
const minioStore=useMinioStore()
const message = useMessage();

const loading=ref(true)

const showModal=ref(false)
const uploadModalRef=ref()

const preSignInfo:{
    url?:string,
    fileName?:string
}={}

const modelRef = ref<User>({});
const imgSrc=ref<string>('')
const faceState=reactive<Result>({
    base64:'',
    file:null,
})

const handleUpload=async ()=>{
    // fileToBase64((file.file)as File,(base64:string)=>{
    //         console.log('压缩前',base64);
    //         modelRef.value.avatar=base64
    //     // imgCompress(base64,(res:string)=>{
    //     //     console.log('压缩后',res);
    //         // modelRef.value.avatar=res
    //         showModal.value=true
    // })
    // preSignInfo.fileName=faceState.file?.name
    preSignInfo.fileName='avatar.png'

    const params={
        bucketName:'picture',
        fileName:preSignInfo.fileName,
    }
    //获取预签名url
    const url=await minioStore.MINIO_GET_URL(params)
    if(url)preSignInfo.url=url.data.data.url
    //put方法直接上传file至预签名url
    const res=await minioStore.MINIO_PUT({
        url:preSignInfo.url,
        data:faceState.file,
        headers: {
            'Content-Type': faceState.file?.type
        },
    })
    //上传成功回调
    if(res){
        message.success('上传成功')
        handleUpdate()            
        loading.value=false
        faceState.base64=''
        faceState.file=null
    }

}



const handleModalOk=async ()=>{
    // console.log(uploadModalRef.value);
    if(uploadModalRef.value.isClipperReady){
        const alter=await uploadModalRef.value.getAlter()
        console.log('alter,alter.file',alter,alter.file);
        if(alter){
            imgSrc.value=alter.base64
            Object.assign(faceState,alter)
            modelRef.value.avatar=alter.base64
            showModal.value=false
        }
    }else{
        message.error('请先选择图片')
    }
}

const handleUpdate=async ()=>{
    modelRef.value.avatar=`@oss/picture/${modelRef.value.username}/${preSignInfo.fileName}`
	const res = await userStore.USER_SET(modelRef.value)
	const { code, message, meta, data = {} } = res.data
    if(data.birth){
        data.birth=new Date(data.birth)
    }
    if(data.avatar){
        data.avatar=data.avatar+`?${new Date().getTime()}`
    }
	Object.assign(modelRef.value, data)
}

const getUserInfo = async () => {
	const res = await userStore.USER_GET(userStore.userInfo.username!)
    if(!res){
        return
    }
	const { code, message, meta, data = {} } = res.data
    if(data.birth){
        data.birth=new Date(data.birth)
    }
    if(data.avatar){
        data.avatar=data.avatar+`?${new Date().getTime()}`
    }
	Object.assign(modelRef.value, data)
    imgSrc.value=data.avatar
    
};
onMounted(() => {
	getUserInfo();
});

</script>

<style lang="less" scoped>
// @import '@/views/root.less';
.container{
    height:100%;
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
