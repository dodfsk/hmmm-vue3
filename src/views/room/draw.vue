<template>
	<div class="container">
		<n-card class="content">
			<template #header>
				<div style="text-align: left">#绘制房间</div>
                <div class="content-header">
                    <n-input-group class="input-group">
                            <n-input placeholder="标题" v-model:value="title"  class="title" autofocus/>
                            <n-input 
                            placeholder="描述" 
                            v-model:value="description" 
                            :class="animationFlag?'description-enabled':'description'" 
                            />
                            <!-- @animationend="animationFlag=false" -->
                            
                    </n-input-group>

                    <n-button-group>
                            <n-button type="primary"  @click="handleAnimation">添加描述</n-button>
                            <n-button type="info"  @click="handleCover"> 上传封面</n-button>
                    </n-button-group>
                </div>
            </template>

			<div class="edit_box">
				<quill-editor-deck
					v-if="!editSwitch"
					ref="quillEditorRef"
					v-model:content="content"
					@ready="quillReady"
				/>
				<tip-tap-editor 
                    v-else v-model="content"
                    ref="tipTapRef"
                > 
                </tip-tap-editor>
			</div>
			<template #footer>
				<n-space justify="end" class="footer">
					<n-button @click="handleSwitch"> 切 换 </n-button>

					<n-button type="primary" @click="handlePublish"> 发 布 </n-button>
				</n-space>
			</template>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import QuillEditorDeck, { DefineExpose } from '@/components/rich-editor/quillEditor.vue';
import tipTapEditor,{DefineExpose as De} from '@/components/rich-editor/tipTapEditor.vue';
import { onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { Room } from '@/types/room';
import { useRoomStore } from '@/store/room';

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
console.log('route.params.id', route.params.id);

const quillEditorRef = ref<DefineExpose | undefined>();
const tipTapRef=ref<De|undefined>()
let quill: DefineExpose['quill'] | undefined;
let editSwitch = ref<boolean>(true);
const animationFlag=ref(false)

let roomState = reactive<Room>({
	hid: undefined,
	title: '',
    description:'',
	content: '',
});
const { title,description, content } = toRefs(roomState);

onMounted(() => {
	quill = quillEditorRef.value?.quill;
	console.log('quill', quill);
	// console.log('quillEditorRef.value...', quillEditorRef.value);
	// console.log('a=>',quillEditorInstance?.setHTML(
	//     String(route.params.id)
	// ));
    // let options=document.querySelectorAll('.ql-header.ql-picker')
    // let options=document.querySelectorAll('.ql-picker-options')
    // let toolbar=document.querySelector('.ql-toolbar.ql-snow')
    // let div = document.createElement('div')
    // // div.style.overflowY="visible"
    // // div.style.overflowX="auto"
    // // format?.parentNode?.insertBefore(div, format)
    // setTimeout(()=>
    // options.forEach((item,index)=>{
    //         console.log(item);
    //         console.log(toolbar);

    //         if(toolbar){
    //             toolbar.setAttribute('style','overflow-x:clip')
    //         }
    // })
    // ,2000)

});
// const contentChange = () => {
// 	console.log(content.value);
// };
const quillReady = () => {
	console.log('quill-editor is ready');
};
const handleSwitch = () => {
	editSwitch.value = !editSwitch.value;
};

const handlePublish = async () => {
    if(!editSwitch.value){
        roomState.content=quill?.getHTML()//重新获取HTML
    }
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
};
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
		// roomState.title=data.title
		// roomState.content=data.content
		// roomState.hid=data.hid
		Object.assign(roomState, data);
		quill?.setHTML(roomState.content);
        tipTapRef.value?.editorRef.editor.commands.setContent(roomState.content)
		// loading.value=false
	}
};

// watch(
// 	() => roomState.content,
// 	() => {
// 		console.log('content', roomState.content);
// 	}
// 	// { immediate:true,deep:true}
// );

watch(
	() => route.query.id,
	() => {
		if (route.query.id) {
			getRoomDetail(route.query.id as string);
		}
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
@import '@/views/root.less';
@import '@/utils/less/animation.less';

.container {
	width: 100%;
    height: 100%;
	// min-height: 100%;
	// background-color: #ccc;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
.content {
	width: 90%;
	height: 90%;
	min-height: 500px;
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
}
.edit_box {
	height: 550px;
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
