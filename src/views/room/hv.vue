<template>
	<div class="container">
		<div class="content">
			<n-card class="content-left" header-style="padding: 10px;" content-style="padding: 0;">
				<template #header class="content-left-header">
					<n-space justify="start" >
						{{ `${title}_____from:${from}` }}
					</n-space>
				</template>
                <template #header-extra>
					<n-button-group>
						<n-button type="primary" dashed round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" dashed round @click="handleDel"> 删 除 </n-button>
					</n-button-group>
				</template>


				<n-skeleton v-if="loading" :sharp="false" />
				<div class="edit-box" v-else>
					<!-- <div class="html-box ProseMirror" v-html="content"></div> -->

					<tiptapEditor
                        theme="headless"
                        v-model="content"
                    >
                    </tiptapEditor>
				</div>

				<!-- :readOnly="true" -->
			</n-card>

			<n-card class="content-right" hoverable>
				<template #header class="content-right-header">
					<n-button-group>
						<!-- <n-button type="primary" round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" round @click="handleDel"> 删 除 </n-button> -->
					</n-button-group>
				</template>
			</n-card>
            
		</div>
		<div class="comment" v-for="item in roomState.comment">
			<n-card class="comment-left" header-style="padding: 10px;" content-style="padding: 0;">
				<template #header>
					<n-space justify="start" class="comment-left-header">
						{{ `from:${item.from}` }}
					</n-space>
				</template>

				<template #header-extra>
					<n-button-group>
						<n-button type="primary" round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" round @click="handleDel"> 删 除 </n-button>
					</n-button-group>
				</template>

				<n-skeleton v-if="loading" :sharp="false" />
				<div class="edit-box" v-else>
					<!-- <div class="html-box" v-html="content"></div> -->
					<!-- <tip-tap-editor
                        v-model="item.content"
                    >
                    </tip-tap-editor> -->
				</div>

				<!-- :readOnly="true" -->
			</n-card>

            <n-card class="comment-right" hoverable>
				<template #header class="comment-right-header">
					<!-- <n-button-group>
						<n-button type="primary" round @click="handleEdit"> 编 辑 </n-button>
						<n-button type="error" round @click="handleDel"> 删 除 </n-button>
					</n-button-group> -->
				</template>
			</n-card>

		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import tiptapEditor from '@/components/rich-editor/tiptapEditor.vue';
import { onBeforeMount, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRoomStore } from '@/store/room';
import { useUserStore } from '@/store/user';
import { Room } from '@/types/room';

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
const userStore = useUserStore();
console.log('route.params.id', route.params.id);

const loading = ref(true);
let roomState = reactive<Room>({
	hid: undefined,
	title: '',
	content: '',
    from:'',
    comment:undefined
});
const { title, content,from,comment } = toRefs(roomState);

const handleEdit = () => {
    if(userStore.userInfo.role!=='root'&&userStore.userInfo.username!==roomState.from){
        return window.$message.warning('没有权限')
    }
	router.push({
		path: `/creator/draw`,
		query: { id: route.params.id },
	});
};
const handleDel = async () => {
	const res = await roomStore.ROOM_DEL(roomState.hid as string);
	const { code } = res.data;
	if (code == 200) {
		router.push({
			path: `/room`,
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
		Object.assign(roomState, data);
		loading.value = false;
	}
};

onMounted(() => {

});

watch(
	() => route.params.id,
	() => {
		if (route.params.id) {
		    getRoomDetail(route.params.id as string);
        }
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
// @import '@/views/root.less';

.container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// justify-content:space-evenly;
	align-items: center;
    overflow:auto;

    .content {
        // margin:0 auto;
	    // width: 100%;
	    // width: 1200px;
	    // width: 100%;
        margin: 0 auto;
        padding:5px 20px;
        display: flex;
        // justify-content:  center;
        // flex-wrap: wrap;
    }
    .comment{
	    // width: 80%;
	    display: flex;
        // justify-content: center;
        margin: 0 auto
    }
}

.content-left,.comment-left{
    width:900px;
    // max-width:900px;
    // width:100%;
    // min-width:700px;
	height: 100%;
    margin-bottom: 10px;
	// .area_header{}
    :deep(.n-card-header) {
        // border: 2px solid #666;
        
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
		height: 100%;
		// border: 2px solid #666;
		// border-top: none;
		border-top: 1px solid #666;
            padding: 0.75rem;
		// .html-box {
        //     padding: 1rem 0.75rem;
        //     flex: 1 1 auto;
        //     overflow-x: hidden;
        //     overflow-y: auto;
        //     -webkit-overflow-scrolling: touch;
		// }
	}
}
.content-right,.comment-right {
	width: 300px;
	// min-width: 200px;
	min-width: 300px;
	height: 300px;
	margin-left: 5px;
	min-height: 200px;
	// border: 2px solid #666;
	// position: fixed;
    :deep(.n-card-header){
        background-color:rgba(109, 135, 251, 0.486);
        display: flex;
        justify-content: end;
    }
}
@media screen and (max-width:520px){
    .content-right,.comment-right{
        display:none;

    }
}

</style>
