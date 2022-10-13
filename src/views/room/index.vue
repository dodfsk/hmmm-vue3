<template>
<div class="container">
    <div class="header">
        <n-space justify="start" style="width: 100%">
            <!-- <n-button type="primary" @click="roomDraw">
                绘制Room
            </n-button> -->
            
            <n-carousel autoplay  class="my-carousel">
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
                    
            <n-card  v-for="(item,index)  in coinList" :key="index" class="coinBar" hoverable>
                <h2>{{index}}</h2>
                <div>CNY:{{item?.CNY}}</div>
                <div>USD:{{item?.USD}}</div>
            </n-card>

        </n-space>


    </div>

    <div class="grid">

        <n-card :title="item.title" v-for="item in roomList" hoverable>
            <template #cover>
                <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg">
            </template>

            <div class="box">
                {{item.description}}
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
        preset="card"
        :style="windowStyle"
        title="视窗模式"
        size="huge"
        :bordered="false"
        :block-scroll="true"
        :segmented="{
            content: 'soft',
            footer: 'soft'
        }"
        @after-leave="handleCloseModal"
    >
        <template #header-extra>
        
        </template>
        <QuillEditorDeck
            theme="bubble"
            readOnly="true"
            :scrollingContainer="true"
            v-model:content="windowContent"
        />
        <template #footer>
        点赞---点踩    
        </template>
    </n-modal>

</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {useRouter,useRoute, onBeforeRouteUpdate, onBeforeRouteLeave} from 'vue-router'
import { Search,ArrowUp } from "@vicons/ionicons5";
import  QuillEditorDeck  from '@/components/rich-editor/quillEditor.vue' 
import { useRoomStore } from '@/store/room';
import { Room } from '@/types/room';
import { api } from '@/api/common/coin';
import axios from 'axios';
import videoList from '@/assets/json/videoList.json'

const router=useRouter()
const route=useRoute()
const roomStore=useRoomStore()
const showModal=ref(false)
const windowContent=ref<string>()
let roomList=ref<Array<Room>>(videoList.data)
    
type price={
    CNY:string
    USD:string
}
type CoinList={
    BTC?:price
    ETH?:price
}
let coinList=ref<CoinList>({})

const roomDraw=()=>{
    router.push({
        path:`/room/draw`,
    });
}
const roomEnter=(hid?:string)=>{
    router.push({
        path:`/room/${hid}`,
        // name:'id',
        // params:{id:hid},
        // query: mergeProps(route.query, {
        //   detailId: item,
        // }),
    });
}
const handleShowModal=async (hid?:string)=>{
    router.push({
        query:{...route.query,window:hid}
    })
    const res=await roomStore.ROOM_GET(hid)
    const { code,data={} } = res.data
    windowContent.value=data.content
    showModal.value=true
}
const handleCloseModal=()=>{
    const { window,...backQuery }= route.query
    //解构取反
    router.push({query:backQuery})
}

const getRoomList=async ()=>{
    const {keyword}=route.query
    let query:object|undefined=undefined
    if(keyword){
         query={from:keyword}
    }
    const res=await roomStore.ROOM_LIST(query)
    const { code,data={} } = res.data
    if(res.status==200){
        roomList.value=data.roomList
        console.log('roomList',roomList.value,res.data.roomList);
        
    }
}

const getCoinList=async ()=>{
    const res=await axios.get(api)
    if(res.status==200){
        coinList.value=res.data
    }
}
onMounted(() => {
    getRoomList()
    getCoinList()
})

// watch(
//     ()=>route.query,
//     (newValue, oldValue)=>{
//         console.log('newValue, oldValue',newValue, oldValue);
//         if(!newValue.window&&!oldValue?.window)
//             if(route.name=='room'||route.name=='search')
//                 getRoomList()
//     },
//     {immediate:true,deep:true}
// )


//定义modal的style
const windowStyle={
    width:'700px',
}
</script>

<style lang='less' scoped>
@import '@/views/root.less';

.container{
    width:calc(100vw - 8%);
    // min-width:600px;
    height: 100%;
    // background-color: #ccc;
    margin:0 auto;
    padding: 10px;
    // display: flex;
    // justify-content: center;
	// align-items: center;
    // overflow: scroll;
}
.header{
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
	align-items: center;
    margin-bottom: 40px;
}
.box{
    // width: 200px;
    // height: auto;
    display: flex;
    justify-content: start;
	// align-items: center;

}
.grid {
    height:100%;
    justify-content: space-evenly;
    display: grid;
    grid-template-columns: repeat(auto-fill, 270px);
    grid-gap: 12px;
    .n-card{
    max-width: 270px;
    height: 250px;
    :deep(&-cover){
        max-height: 120px;
    }
    :deep(&__content){
        text-overflow: ellipsis;
        overflow: hidden;
    }
    :deep(&__action){
        padding:5px;
    }
}
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;//居中自动剪裁图片
}

.coinBar{
    height: 150px;
    width:153px;
    text-align: left;
}
.my-carousel{
    max-width:600px;
    width:calc(100vw - 30%);
}

:deep(#editor-resizer) {
	display: none;
} //关闭富文本图片resize模块
</style>