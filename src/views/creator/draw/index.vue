<template>
	<div class="draw-container">
		<n-card class="content">
			<template #header>
				<div style="text-align: left">#绘制房间</div>
                <div class="content-header">
                    <n-input-group class="input-group">
                            <n-input placeholder="标题" v-model:value="title"  class="title" autofocus
                            style="outline:3px solid #000"
                            />
                            <n-input 
                            placeholder="描述" 
                            v-model:value="description" 
                            :class="animationFlag?'description-enabled':'description'" 
                            style="outline:3px solid #000;border-radius: 0;"
                            />
                            <!-- @animationend="animationFlag=false" -->
                            
                    </n-input-group>

                    <n-button-group
                        style="outline:3px solid #000;border-radius: 0 5px 5px 0;margin-right:5px;"
                    >
                            <n-button color="black"  @click="handleAnimation">添加描述</n-button>
                            <n-button color="#666"  @click="handleCover"> 上传封面</n-button>
                    </n-button-group>
                </div>
            </template>

			<div class="content-edit_box">
				<tiptapEditor
                    v-if="!route.query.id||content"
                    :key="String(route.query.id)||'defaultKey'"
                    v-model="content"
                    v-model:assets="assets"
                    ref="tipTapRef"
                /> 
			</div>
			<template #footer>
				<n-space justify="end" class="footer">
                        <n-button type="info" @click="handleSave">保存</n-button>
                        <n-button type="primary" @click="handlePublish"> 发 布 </n-button>
				</n-space>
			</template>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import tiptapEditor,{ DefineExpose } from '@/components/rich-editor/tiptapEditor.vue';
import { throttle,debounce } from 'lodash-es'
import { Room } from '@/types/room';
import { useRoomStore } from '@/store/room';

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
console.log('route.params.id', route.params.id);

const tipTapRef=ref<DefineExpose|undefined>()

const animationFlag=ref(false)

const roomState = reactive<Room>({
	hid: undefined,
	title: '',
    description:'',
	content: '',
    assets:[],
});

const { title,description,content,assets } = toRefs(roomState);

onMounted(() => {
    
});

const handleSave=debounce(async ()=>{
    console.log('roomState.assets',roomState);
	if (roomState.content) {
		// const room: Room = {
		// 	title: roomState.title,
		// 	content: roomState.content,
		// };
		console.log('roomState.content', roomState.content);
		const res = await roomStore.ROOM_SET(roomState);
		const { code, data = {} } = res.data;
		if (code == 200) {
			window.$message.success('保存成功')
		}
	}
},800,{
  leading: true,
  trailing: false
})

const handlePublish = debounce(async () => {
    console.log('roomState.assets',roomState);
	if (roomState.content) {
		// const room: Room = {
		// 	title: roomState.title,
		// 	content: roomState.content,
		// };
		console.log('roomState.content', roomState.content);
		const res = await roomStore.ROOM_SET(roomState);
		const { code, data = {} } = res.data;
		if (code == 200) {
			router.push({
				path: `/room/${data.hid}`,
			});
		}
	}
},800,{
  leading: true,
  trailing: false
})
const handleAnimation=()=>{
    animationFlag.value=!animationFlag.value
}
const handleCover=async ()=>{

}

const getRoomDetail = async (id: string) => {
	const res = await roomStore.ROOM_GET(id);
	const { code, data = {} } = res.data;
	if (code == 200) {
		// roomState={...(res?.data)}
		// console.log(roomState);
		Object.assign(roomState, data);
		// roomState.title=data.title
		// roomState.hid=data.hid
		// roomState.content=data.content
        // tipTapRef.value!.editorRef.editor.commands.setContent(roomState.content)
		// loading.value=false
	}
};


watch(
	() => route.query.id,
	() => {
		if (route.query.id) {
			getRoomDetail(route.query.id as string);
		}
        else{
		    Object.assign(roomState, {
                hid: undefined,
                title: '',
                description:'',
                content: '',
                assets:[],
            });
        }
	},
	{ immediate: true }
)

//调试用watch
// watch(
// 	() => roomState.content,
// 	() => {
// 		console.log('content', roomState.content);
// 	}
// 	// { immediate:true,deep:true}
// );
</script>

<style lang="less" scoped>
@import '@/utils/less/animation.less';

.draw-container {
	width: 100%;
    height: 100%;
    // padding-top:20px;
	display: flex;
    flex-direction: column;
	// justify-content: center;
	align-items: center;
    overflow: auto;
    background-color: #f5f5f5;
}
.content {
	// width: 90%;
	// height: 90%;
	// min-height: 500px;
	max-width: 1500px;
}
.content-header{
    display: flex;
    justify-content: space-between;
    // .title{
    //     // min-width:20px;
    // //    width: 800px;1
    // //    width:100%;
    // }
    .description{
        display: none;
        width: 0px;
    }
    .description-enabled{
        animation: widthChange 0.9s ease-out;
    }
    .keyframes (all,widthChange,{
        from {width:0px;}
        to {width:100%;}
    })

}
.input-group{
    justify-content: space-between;
    padding:0 0 0 3px;
}
.content-edit_box {
	height: 600px;
    // min-width:800px;
	// border: 1px solid #888;
	// border-radius: 7px 0 0 7px;
}
.footer {
	margin-top: 10px;
}

.n-button {
	width: 90px;
}
</style>
