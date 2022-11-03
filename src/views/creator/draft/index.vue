<template>
	<div class="draft-container">
		<div class="draft-box">
			<div class="header">
                <n-divider title-placement="left">
					<h2>草稿箱</h2>
                </n-divider>
			</div>
			<div class="content">
                <n-list class="content-list" hoverable clickable show-divider borderd style="width:100%">
                    <!-- <template #header>
                        草稿列表
                    </template>  -->
                    <!-- <template #footer>
                        底部
                    </template> -->
                    <n-list-item 
                        v-for="item in draftList"
                        class="content-list-item" 
                    >
                        <template #suffix>
                            <n-button-group>
                                <n-button round secondary @click="draftEdit(item)">编辑</n-button>
                                <n-button round secondary @click="draftDelete(item)">删除</n-button>
                            </n-button-group>
                        </template>
                        <div>{{item.title}}</div>
                        <div>{{item.description}}</div>
                    </n-list-item>
                    <n-space v-if="draftList.length===0" justify="center" align="center" style="width:100%;height:180px">
                    <div>
                        你还没有草稿呢,点击绘制创建模板吧
                    </div>
                </n-space>
                </n-list>

			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, Component, reactive, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useRoomStore } from '@/store/room';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns'
import { Room } from '@/types/room';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const roomStore = useRoomStore();
const draftList= ref<Room[]>([])

const draftEdit=(data:Room)=>{
    router.push({
        path: `/creator/draw`,
        query:{
            id:data.hid
        }
    });
}

const draftDelete=async (data:Room)=>{
	const res = await roomStore.ROOM_DEL(data.hid!)
    const { code, message, meta } = res.data
    if(code==200){
        draftList.value=draftList.value.filter((item)=>item.hid!==data.hid)
    }

}

const getDraftList = async () => {
	const res = await roomStore.ROOM_LIST({from:userStore.userInfo.username!,isPublic:false})
	const { code, message, meta, data = {} } = res.data
    if(code!==200){
        return
    }
    if(data.roomList){
        // draftList.value=data.roomList.filter((item:Room)=>!item.isPublic)
        draftList.value=data.roomList
    }

};
onMounted(() => {
	getDraftList();
});
</script>


<style lang="less" scoped>
.draft-container {
    width:100%;
    height:100%;
    background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}
.draft-box {
	width:1200px;
	height:100%;
	padding: 30px 0;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.721);
	display: flex;
	flex-direction: column;
	align-items: center;

	.header {
		width: 100%;
	}
	.content {
		width: 100%;
		// display: flex;
		// flex-direction: column;
		// align-items: start;
		// gap: 24px;
	}
    // .content-list{
    //     // padding:50px;
    // }

}

.circle {
	width: 100px;
	height: 100px;
	padding: 3px;
	// border: 1px solid #000;
	border-radius: 50px;
	background-color: darkslateblue;
	text-align: center;
}

</style>
