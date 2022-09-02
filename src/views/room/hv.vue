<template>
	<div class="container">
		<div class="content">
			<n-card class="content-left" header-style="padding: 10px;" content-style="padding: 0;">
				<template #header class="content-left-header">
					<n-space justify="start" >
						{{ title }}
					</n-space>
				</template>

				<n-skeleton v-if="loading" :sharp="false" />
				<div class="edit-box" v-else>
					<!-- <div class="html-box" v-html="content"></div> -->
					<quill-editor-deck
						ref="quillEditorRef"
						theme="bubble"
						readOnly="true"
						v-model:content="content"
						@ready="quillReady"
					/>
					<!-- <tip-tap-editor
                        v-model="content"
                    >
                    </tip-tap-editor> -->
				</div>

				<!-- :readOnly="true" -->
			</n-card>

			<n-card class="content-right" hoverable>
				<template #header class="content-right-header">
					<n-button-group>
						<n-button type="primary" round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" round @click="handleDel"> 删 除 </n-button>
					</n-button-group>
				</template>
			</n-card>
            
		</div>
		<div class="comment">
			<n-card class="comment-left" header-style="padding: 10px;" content-style="padding: 0;">
				<template #header>
					<n-space justify="start" class="comment-left-header">
						{{ title }}
					</n-space>
				</template>

				<!-- <template #header-extra>
					<n-button-group>
						<n-button type="primary" round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" round @click="handleDel"> 删 除 </n-button>
					</n-button-group>
				</template> -->

				<n-skeleton v-if="loading" :sharp="false" />
				<div class="edit-box" v-else>
					<!-- <div class="html-box" v-html="content"></div> -->
					<quill-editor-deck
						ref="quillEditorRef"
						theme="bubble"
						readOnly="true"
						v-model:content="content"
						@ready="quillReady"
					/>
					<!-- <tip-tap-editor
                        v-model="content"
                    >
                    </tip-tap-editor> -->
				</div>

				<!-- :readOnly="true" -->
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import QuillEditorDeck, { DefineExpose } from '@/components/rich-editor/quillEditor.vue';
import tipTapEditor from '@/components/rich-editor/tipTapEditor.vue';
import { onBeforeMount, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRoomStore } from '@/store/room';
import { Room } from '@/types/room';
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
console.log('route.params.id', route.params.id);
// let quillEditorRef = ref();
const quillEditorRef = ref<DefineExpose | undefined>();

const loading = ref(true);
let roomState = reactive<Room>({
	hid: undefined,
	title: '',
	content: '',
});
const { title, content } = toRefs(roomState);

const quillReady = () => {
	console.log('quill-editor is ready');
	setTimeout(() => {
		let resizer = document.querySelector('#editor-resizer');
		console.log('ifram', resizer);
		resizer?.remove();
	}, 2000);
};

const handleEdit = () => {
	router.push({
		path: `/room/draw`,
		query: { id: route.params.id },
	});
};
const handleDel = async () => {
	const res = await roomStore.ROOM_DEL(roomState.hid as string);
	const { code } = res.data;
	if (code == 200) {
		router.push({
			path: `/`,
		});
	}
};

const getRoomDetail = async (id: string) => {
	const res = await roomStore.ROOM_GET(id);
	const { code, data = {} } = res.data;
	if (code == 200) {
		// roomState={...(res?.data)}
		// console.log(roomState);
		// title.value=data.title
		// content.value=data.content
		// console.log('content----------',content.value);
		// console.log('ins----------',quillEditorRef.value?.quill?.getHTML());
		Object.assign(roomState, data);
		loading.value = false;
		// quillEditorRef.value?.quill?.setContents(content.value)
	}
};

onMounted(() => {
	// console.log('quillEditorRef', quillEditorRef);
	const quill = quillEditorRef.value?.quill;
	// console.log('ins----------',quill?.getContents());

	// console.log('quillEditorRef.value...', quillEditorRef.value);
	// console.log('a=>',quillEditorInstance?.setHTML(
	//     // String(route.params.id)
	//     '<h1><span class="ql-size-huge">他妈的我真是服了</span><strong class="ql-size-huge"><em><s><u>你这个老六</u></s></em></strong></h1>'
	// ));
});

watch(
	() => route.params,
	() => {
		getRoomDetail(route.params.id as string);
	},
	{ immediate: true, deep: true }
);
</script>

<style lang="less" scoped>
@import '@/views/root.less';
.container {
	width: 90%;
	height: 100%;
	// min-height: 100%;
	// background-color: #ccc;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	// justify-content:space-evenly;
	// align-items: center;
    .content {
        margin-top: 20px;
        display: flex;
    }
    .comment{
        min-width:600px;
	    display: flex;
    }
}

.content-left,.comment-left{
	width: 80%;
    min-width:600px;
	height: 100%;
	margin-right: 20px;
    margin-bottom: 10px;
	// .area_header{}
       :deep(.n-card-header) {
		    border: 2px solid #666;
            
            min-height: 50px;
	    }

	.n-skeleton {
		min-height: 500px;
		height: 80%;
		width: 100%;
		// height:100%;
		// border-radius: 7px 0 0 7px;
	}
	.edit-box {
		min-height: 500px;
		height: 80%;
		border: 2px solid #666;
		border-top: none;
		.html-box {
			text-align: left;
		}
	}
}
.content-right {
	width: 300px;
	min-width: 300px;
	height: 500px;
	min-height: 300px;
	// border: 2px solid #666;
	// position: fixed;
    :deep(.n-card-header){
        background-color:rgba(172, 255, 47, 0.486);
        display: flex;
        justify-content: end;
    }
}


:deep(#editor-resizer) {
	display: none;
} //关闭
</style>
