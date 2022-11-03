<template>
<div class="container">
    <div class="header">
        <n-space>
            <n-input
                placeholder="请输入查询条件"
                clearable
                v-model:value="searchValue"
                @keyup.enter="handleSearch"
            >
            </n-input>
            <n-button
                type="primary"
                @click="handleSearch"
            >
            搜索
            </n-button>
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

        <tiptapEditor
                ref="editorRef"
                theme="headless"
                v-model="windowContent"
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
import tiptapEditor from '@/components/rich-editor/tiptapEditor.vue';
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
const searchValue=ref()

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
        path:`/creator/draw`,
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

const handleSearch=()=>{
    router.push({
        path: '/search',
		query: { keyword: searchValue.value },
        }
    )
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
    // getRoomList()
    getCoinList()
})

watch(
    ()=>route.query,
    (newValue, oldValue)=>{
        console.log('newValue, oldValue',newValue, oldValue);
        if(!newValue.window&&!oldValue?.window)
            if(route.name=='room'||route.name=='search')
                getRoomList()
    },
    {immediate:true,deep:true}
)


//定义modal的style
const windowStyle={
    width:'700px',
}
</script>

<style lang='less' scoped>
@import '@/views/root.less';

.container{
    width:100%;
    height: 100%;
    margin:0 auto;
    padding: 10px;
    display: flex;
	flex-direction: column;
    // justify-content: center;
	align-items: center;
    overflow: auto;
    // min-width:600px;
    // background-color: #ccc;
}
.header{
    width: 80%;
    height: 80px;
    padding: 10px;
    display: flex;
    justify-content: center;
	align-items: center;
    margin-bottom: 40px;
    background-color: rgba(255, 255, 255, 0.731);
}
.box{
    // width: 200px;
    // height: auto;
    display: flex;
    justify-content: start;
	// align-items: center;

}
.grid {
    width:80%;
    justify-content: space-evenly;
    display: grid;
    grid-template-columns: repeat(auto-fill, 240px);
    grid-gap: 15px;
    .n-card{
    max-width: 240px;
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

</style>