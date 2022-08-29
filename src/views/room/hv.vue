<template>
	<div class="content">
		<n-card class="box">
			<template #header>
				{{ roomTitle }}
			</template>

			<quill-editor-deck
                ref="quillEditorRef"
                theme="bubble"
                :readOnly="true"
                v-model:content="roomContent"
                @ready="quillReady"
            />

		</n-card>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import QuillEditorDeck, { DefineExpose } from '@/components/quill-editor/quillEditor.vue';
import { onMounted, provide, reactive, ref } from 'vue';
import { useRoomStore } from '@/store/room';
import { Room } from '@/types/room';
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

const route = useRoute();
const router = useRouter();
const roomStore=useRoomStore()
console.log('route.params.hv', route.params.hv);
// let quillEditorRef = ref();
const quillEditorRef=ref<DefineExpose|undefined>()

// let roomState=reactive<Room>({
//     title:'',
//     content:''
// })
const roomTitle=ref()
const roomContent=ref<string>('')

const quillReady=()=>{
    console.log('quill-editor is ready');
}

const getRoomDetail=async (id:string)=>{
    const res=await roomStore.ROOM_SEARCH(id)
    const { code }=res
    if(code==200){
        // roomState={...(res?.data)}
        // console.log(roomState);
        roomTitle.value=res.data.title
        roomContent.value=res.data.content
        console.log(roomContent.value);
        
        quillEditorRef.value?.quillEditorRef?.setContents(roomContent.value)
    }
}

onMounted(() => {
	// console.log('quillEditorRef', quillEditorRef);
	const quillEditorInstance = quillEditorRef.value?.quillEditorRef;
    getRoomDetail(route.params.hv as string)
    console.log('ins----------',quillEditorInstance?.getContents());
    
	// console.log('quillEditorRef.value...', quillEditorRef.value);
    // console.log('a=>',quillEditorInstance?.setHTML(
    //     // String(route.params.hv)
    //     '<h1><span class="ql-size-huge">他妈的我真是服了</span><strong class="ql-size-huge"><em><s><u>你这个老六</u></s></em></strong></h1>'
    // ));
});



</script>

<style lang="less" scoped>
.content {
	width: 95%;
	height: 90vh;
	// background-color: #ccc;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
.box {
	width: 80%;
}
.n-skeleton {
	height: 350px;
	width: 600px;
	border-right: 1px solid #888;
	border-radius: 7px 0 0 7px;
}
</style>
