<template>
<div class="content">
    <div class="header">
        <n-space>
        <n-carousel autoplay style="width:500px">
            <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
            >
            <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
            >
            <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
            >
            <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
            >
        </n-carousel>


            <n-button type="primary" @click="roomDraw">
                发布Room
            </n-button>

        </n-space>

    </div>

    <div class="grid">

        <n-card :title="item.title" v-for="item in roomList" hoverable>
            <template #cover>
                <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg">
            </template>

            <div class="box">
                {{item.title}}
            </div>

            <template #action>
                <n-space justify="space-around">

                <n-button strong secondary @click="handleShowModal(item.hid)">
                    <template #icon>
                        <n-icon :component="Search">
                        <cash-icon />
                        </n-icon>
                    </template>
                    Window
                </n-button>

                <n-button type="primary" @click="roomEnter(item.hid)">
                    <template #icon>
                        <n-icon :component="ArrowUp">
                        <cash-icon />
                        </n-icon>
                    </template>
                    Door
                </n-button>

                </n-space>

            </template>

        </n-card>

 
    </div>

    <n-modal
        v-model:show="showModal"
        class="custom-card"
        preset="card"
        :style="{ width: '600px'}"
        title="卡片预设"
        size="huge"
        :bordered="false"
        :segmented="{
            content: 'soft',
            footer: 'soft'
        }"
        @after-leave="handleCloseModal"
    >
        <template #header-extra>
        噢!
        </template>
        <QuillEditorDeck
            theme="bubble"
            readOnly="true"
            v-model:content="windowContent"
        />
        <template #footer>
        尾部
        </template>
    </n-modal>

</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
import {useRouter,useRoute} from 'vue-router'
import { Search,ArrowUp } from "@vicons/ionicons5";
import  QuillEditorDeck  from '@/components/quill-editor/quillEditor.vue' 
import { useRoomStore } from '@/store/room';
import { Room } from '@/types/room';


const router=useRouter()
const route=useRoute()
const roomStore=useRoomStore()
const showModal=ref(false)
const windowContent=ref<string>()
let roomList=ref<Array<Room>>([])

const roomDraw=()=>{
    router.push({
        path:`/room/draw`,
    });
}
const roomEnter=(hid?:string)=>{
    router.push({
        path:`/room/${hid}`,
        // name:'hv',
        params:{hv:hid},
        // query: mergeProps(route.query, {
        //   detailId: item,
        // }),
    });
}
const handleShowModal=async (hid?:string)=>{
    router.push({
        query:{window:hid}
    })
    const res=await roomStore.ROOM_SEARCH(hid)
    windowContent.value=res.data.content
    showModal.value=true
}
const handleCloseModal=()=>{
    router.push({})
}

const getRoomList=async ()=>{
    const res=await roomStore.ROOM_SEARCH()
    const { code }=res
    if(code==200){
        roomList.value=res.data.roomList
    }
}
onMounted(() => {
    getRoomList()
    console.log(roomList.value);
    
})
</script>

<style lang='less' scoped>
.content{
    width:90vw;
    // height: 100%;
    // background-color: #ccc;
    margin:0 auto;
    // display: flex;
    // justify-content: center;
	// align-items: center;
    // overflow-y: scroll;
}
.header{
    width: 100%;
    display: flex;
    justify-content: center;
	align-items: center;
    margin-bottom: 50px;
}
.box{
    // width: 200px;
    // height: auto;
    display: flex;
    justify-content: start;
	// align-items: center;

}
.grid {
    justify-content: space-between;
    display: grid;
    grid-template-columns: repeat(auto-fill, 220px);
    grid-gap: 8px;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;//居中自动剪裁图片
}
.n-card{
    max-width: 220px;
    height: 350px;
    :deep(&-cover){
        max-height: 145px;
    }
    :deep(&__content){
        text-overflow: ellipsis;
        overflow: hidden;
    }
    :deep(&__action){
        padding:5px;
    }
}
</style>