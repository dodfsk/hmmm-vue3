<template>
	<div class="draw-container">

        <div style="margin:auto" v-if="!route.query.id">
            <n-card class="content" >
                <template #header>
                    <div>设置房间模板</div>
                </template>
                <div class="form-box"
                    :style="{
                        height: '80px',
                        width:'450px',
                        margin:'auto',
                    }"
                >
                    <n-form
                        ref="formRef"
                        :label-width="80"
                        label-placement="left"
                        :model="roomState"
                        size="small"
                        :style="{
                            maxWidth:'400px',
                        }"
                    >
                        <!-- :rules="rules" -->

                        <n-form-item label="类型" path="selectValue">
                            <n-select
                                v-model:value="roomType"
                                placeholder="请选择类型"
                                :options="roomTypeOptions"
                                style="user-select: none;"
                            >
                                <template #action>
                                    目前只做了文本，点击下一步将创建草稿
                                </template>
                            </n-select>
                        </n-form-item>

                    </n-form>
                </div>
                <template #footer>
                    <n-button type="primary" style="float:right" @click="handleDraft">下一步</n-button>
                </template>

            </n-card>
        </div>

		<n-card class="content" v-if="route.query.id">
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

			<div class="edit__box">
				<tiptapEditor
                    v-if="route.query.id"
                    :key="String(route.query.id)||'defaultKey'"
                    v-model="content"
                    v-model:assets="assets"
                    ref="tipTapRef"
                    @handleSaveAssets="handleSaveAssets"
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
import { format } from 'date-fns';
import { throttle,debounce } from 'lodash-es'
import tiptapEditor,{ DefineExpose } from '@/components/rich-editor/tiptapEditor.vue';
import { Room } from '@/types/room';
import { useRoomStore } from '@/store/room';

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
console.log('route.params.id', route.params.id);

const tipTapRef=ref<DefineExpose|undefined>()

const animationFlag=ref(false)

const roomType=ref<string>('文本')
// const roomTypeFlag=ref<boolean>(false)
const roomTypeOptions=['文本', '视频', '音乐'].map((v) => ({
        label: v,
        value: v,
        disabled: v!=='文本'?true:false
}))

const roomState = reactive<Room>({
	hid: undefined,
	title: '',
    description:'',
	content: '',
    assets:[],
    isPublic:false,
});

const { title,description,content,assets } = toRefs(roomState);

onMounted(() => {
    
});

const handleDraft= debounce(async () => {
    roomState.title=` 预创建草稿-于${format(new Date(),'yyyy-MM-dd HH:mm:ss')}`
    console.log('roomState.assets',roomState);
    // const room: Room = {
    // 	title: roomState.title,
    // 	content: roomState.content,
    // };
    console.log('roomState.content', roomState.content);
    const res = await roomStore.ROOM_SET(roomState);
    const { code, data = {} } = res.data;
    if (code == 200) {
        router.push({
            path: `/creator/draw`,
            query:{
                id:data.hid
            }
        });
        window.$message.success('创建草稿成功')
    }
},1000,{
    leading: true,
    trailing: false
})

const handleSave=debounce(async ()=>{
    console.log('roomState.assets',roomState);
	if (roomState.content) {
		console.log('roomState.content', roomState.content);
		const res = await roomStore.ROOM_SET(roomState);
		const { code, data = {} } = res.data;
		if (code == 200) {
			window.$message.success('保存成功')
		}
	}
},1000,{
  leading: true,
  trailing: false
})

const handleSaveAssets=debounce(async ()=>{
    const params={
        hid:roomState.hid,
        assets:roomState.assets,
        from:roomState.from,
    }
    console.log('save-params',params);
	if (roomState.content) {
		const res = await roomStore.ROOM_SET(params);
		const { code, data = {} } = res.data;
		if (code == 200) {
			window.$message.success('附件信息已更新')
		}
	}
},1000,{
  leading: true,
  trailing: false
})

const handlePublish = debounce(async () => {
    roomState.isPublic=true
    console.log('roomState.assets',roomState);
	if (roomState.content) {
		console.log('roomState.content', roomState.content);
		const res = await roomStore.ROOM_SET(roomState);
		const { code, data = {} } = res.data;
		if (code == 200) {
			router.push({
				path: `/room/${data.hid}`,
			});
			window.$message.success('发布成功,现在所有人可见')
		}
	}else{
        window.$message.warning('公开发布之前请先写点什么吧！')
    }
},1000,{
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
    box-shadow: 0 0 1px rgba(51, 51, 51, 0.721);
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
.edit__box {
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
