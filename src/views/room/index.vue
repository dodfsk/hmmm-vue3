<template>
<div class="content">
    <div class="header">
    </div>

    <div class="grid">

        <n-card :title="item.title" v-for="item in roomList.data" hoverable>
            <template #cover>
                <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg">
            </template>

            <div class="box">
                {{item.destription}}
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
    >
        <template #header-extra>
        噢!
        </template>
        <QuillEditorDeck
            theme="bubble"
            :readOnly="true"
            content="windows"
        />
        <template #footer>
        尾部
        </template>
    </n-modal>

</div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import {useRouter,useRoute} from 'vue-router'
import  roomList from "@/assets/json/videoList.json"
import { Search,ArrowUp } from "@vicons/ionicons5";
import  QuillEditorDeck  from '@/components/rich-editor/quillEditor.vue' 

const router=useRouter()
const route=useRoute()
const showModal=ref(false)



const roomEnter=(hid:string)=>{
    router.push({
        path:`/room/${hid}`,
        // name:'hv',
        params:{id:hid},
        // query: mergeProps(route.query, {
        //   detailId: item,
        // }),
    });
}
const handleShowModal=(hid:string)=>{
    router.push({
        query:{hid}
    })
    showModal.value=true
}
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