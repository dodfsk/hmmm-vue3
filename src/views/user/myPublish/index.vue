<template>
	<div class="container">
		<div class="card">
			<div class="header">
				<div class="header-left">
					<h2>我的发布</h2>
					<hr />
				</div>
				<n-button type="primary"> 管 理</n-button>
			</div>
			<div class="content">
				<div class="content-item" v-for="item in publishList">
					<div class="content-item-left">
						<div class="circle" style="color: #fff; padding-top: 35px">Cover</div>
                        <div class="time">
                            {{ 
                                format(item.createdAt!,'yyyy-MM-dd HH:mm:ss') 
                            }}
                        </div>
					</div>
					<div class="content-item-right">
						<div class="content-item-right__header">
							<h1>{{ item.title }}</h1>
						</div>
						<!-- <div class="content-item-right__article" v-html="item.content"> -->
						<div class="content-item-right__article">
                            <!-- <quill-editor-deck
                                ref="quillEditorRef"
                                theme="bubble"
                                readOnly="true"
                                v-model:content="item.content"
                            ></quill-editor-deck> -->
                            <tiptapEditor
                                ref="editorRef"
                                theme="headless"
                                v-model="item.content"
                            />
                        </div>

						<div class="content-item-right__footer">
							{{ item.description }}
							<n-button type="info">查看</n-button>
							<n-button type="primary">编辑</n-button>
						</div>
					</div>
				</div>

                <div v-if="noPublish" style="text-align:center;width:100%">
                        你还没有发布任何内容哦
                </div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, Component, reactive, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useRoomStore } from '@/store/room';
import { useRoute, useRouter } from 'vue-router';
import tiptapEditor from '@/components/rich-editor/tiptapEditor.vue';
import quillEditorDeck  from '@/components/rich-editor/quillEditor.vue'
import { format } from 'date-fns'
import { Room } from '@/types/room';
import { ImgReplace } from '@/utils/img/imgReplace';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const roomStore = useRoomStore();
const noPublish=ref<boolean>(false)
const publishList= ref<Room[]>([]
    // [
    //     {
    //         _id: '630d095d4df7868fb4df2daf',
    //         title: 'test1-nanoid',
    //         from: 'hmlc',
    //         hid: '5FVl5gixDs',
    //         createdAt: '2022-08-29T18:45:49.022Z',
    //         __v: 0,
    //         description: '',
    //         content: '<pre class="my-custom-class"><code>const a=12345\nconst b=()=&gt;{\n  return a\n}\n123</code></pre>',
    //         updateAt: '2022-09-05T19:39:52.175Z',
    //     },
    //     {
    //         content:
    //             '<pre class="ql-syntax" spellcheck="false"><span class="hljs-keyword">const</span> a=<span class="hljs-number">12345</span>\n<span class="hljs-keyword">const</span> <span class="hljs-title function_">b</span>=()=&gt;{\n  <span class="hljs-keyword">return</span> a\n}\n</pre><p><br></p>',
    //         createdAt: '2022-08-29T19:22:47.068Z',
    //         from: 'hmlc',
    //         hid: 'H3m7G3ygvG',
    //         title: 'nanoid test',
    //         updateAt: '2022-08-31T22:39:15.662Z',
    //         __v: 0,
    //         _id: '630d1207b0ec829c98a9e6ec',
    //         message: '查找成功',
    //     },
    // ]
);

const getPublishList = async () => {
	const res = await roomStore.ROOM_LIST({from:userStore.userInfo.username!})
	const { code, message, meta, data = {} } = res.data
    if(code!==200){
        noPublish.value=true
    }
    if(data.roomList){
        data.roomList.forEach((item:Room) => {
            item.createdAt=new Date(item.createdAt!)
            item.content=ImgReplace(item.content)//替换img地址
        });
        publishList.value=data.roomList
    }

};

onMounted(() => {
	getPublishList();
});
</script>

<style lang="less" scoped>
.container {
	background-color: rgba(206, 255, 127, 0.5);
	padding: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}
.card {
	width:80%;
	// height:max-content;
	max-width: 1200px;
	min-width: 500px;
	padding: 30px;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 10px rgba(51, 51, 51, 0.721);
	display: flex;
	flex-direction: column;
	align-items: center;
}
.card .header {
	width: 80%;
	// min-width:500px;
	margin-bottom: 20px;
	display: flex;
	justify-content: center;
	&-left {
		width: 70%;
		text-align: left;
		hr {
			width: 50%;
			min-width: 286px;
			color: '#ccc';
		}
	}
}
.card .content {
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 24px;
}
.card .content-item {
	width: 100%;
	max-height: 500px;
	// border: 1px solid #000;
	border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	display: flex;
	&-left {
		// flex:200px 1 auto;
		width: 150px;
		height: 100%;
		background-color: rgba(127, 255, 212, 0.666);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	&-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		// align-items: start;
		&__header {
			width: 100%;
	        max-height: 45px;
			padding: 5px;
			text-align: left;
			overflow: hidden;
		}
		&__article {
			width: 100%;
	        max-height: 400px;
			padding: 10px;
			text-align: left;
			overflow: auto;
		}
		&__footer {
			height: 50px;
			width: 100%;
			padding: 5px;
			text-align: right;
			background-color: rgba(220, 20, 60, 0.63);
		}
	}
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

:deep(.ql-editor){
    overflow: hidden !important;
}
:deep(#editor-resizer) {
	display: none;
} //关闭富文本图片resize模块
</style>
