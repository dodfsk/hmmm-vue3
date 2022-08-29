<template>
	<div class="content">
		<n-card class="box">
			<template #header>
				<div style="text-align: left">#绘制房间</div>

				<n-input 
                    placeholder="请输入标题" 
                    v-model:value="roomTitle"
                />
			</template>

			<quill-editor-deck 
                ref="quillEditorRef" 
                v-model:content="quillContent" 
                @textChange="quillChange()" 
                @ready="quillReady" 
            />
			<!-- <video 
                    src="@/assets/video/test.mp4"
                    class="item"
                    width="640" 
                    height="480"
                ></video> -->

			<template #footer>
				<n-space justify="end">
					<n-button> 保存 </n-button>

					<n-button type="primary" @click="handlePush"> 发布 </n-button>
				</n-space>
			</template>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import QuillEditorDeck, { DefineExpose } from '@/components/quill-editor/quillEditor.vue';
import { onMounted, provide, ref } from 'vue';
import { Room } from '@/types/room';
import { useRoomStore } from '@/store/room'

const route = useRoute();
const router = useRouter();
const roomStore=useRoomStore()
console.log('route.params.hv', route.params.hv);
// let quillEditorRef = ref();
const quillEditorRef = ref<DefineExpose | undefined>();

const roomTitle = ref<string>('');
const quillContent = ref<string>('');
let quill: DefineExpose['quillEditorRef'] | undefined;

onMounted(() => {
	quill = quillEditorRef.value?.quillEditorRef;
	console.log('quillEditorRef', quillEditorRef);
	console.log('quillEditorRef.value...', quillEditorRef.value);
	// console.log('a=>',quillEditorInstance?.setHTML(
	//     String(route.params.hv)
	// ));
});
const quillChange = () => {
	console.log(quillContent.value);
};
const quillReady = () => {
	console.log('quill-editor is ready');
};
const handlePush =async () => {
	if (quill?.getContents() != undefined) {
		const room: Room = {
			title: roomTitle.value,
			content: quill?.getContents(),
		};
		console.log('room', room);
        const res=await roomStore.ROOM_CREATE(room)
        const { code,data={} }=res
        if(code==200){
            router.push({
                path:`/room/${data.hid}`,
            })
        }
	}
};
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
