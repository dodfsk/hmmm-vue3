<template>
	<span class="file-container">
			<span class="file-name"
                :title="props.fileName"
                @click="reinsert"
            >{{props.fileName}}</span>

			<button class="file-button" v-debounce:click="removeFile">
				<n-icon class="file-icon" size="12" :component="X" />
			</button>
	</span>
</template>

<script setup lang="ts">
import { Trash, X } from '@vicons/tabler';
import { useMinioStore } from '@/store/minio';
import { useRoute } from 'vue-router';

type Props={
    url:string,
    fileName:string,
}
type Emits = {
	(e: 'handleReInsert', value:Props ): void;
	(e: 'handleFileDel', value:Props ): void;
};

const route = useRoute();
const props=defineProps<Props>()
const emits=defineEmits<Emits>()

const minioStore=useMinioStore()

const reinsert=async ()=>{
    // if(window.getSelection()?.toString()){
    //     return//如果用选中文字，中断点击事件
    // }
    emits('handleReInsert',props)
}
const removeFile=async ()=>{
    const fileParams={
        bucketName:'archive',
        subName:route.query.id??route.params.id,
        fileName:props.fileName,
    }
    const res=await minioStore.MINIO_DEL(fileParams)
    if(res.status===200){
        emits('handleFileDel',props)
    }
}

</script>

<style lang="less" scoped>

.file-container {
	border: 2px solid #0d0d0d;
	border-radius: 5px;
	width: 100px;
    height:30px;
	overflow: hidden;
	white-space: nowrap;
	padding: 3px;
    margin-right:3px;
}

.file-name {
    display:inline-block;
	font-size: 12px;
	line-height: 13px;
	max-width: 100px;
	height: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
    cursor:pointer;
    user-select: none;;
}
.file-button {
	width: 12px;
	height: 12px;
	color: #0d0d0d;
	border: none;
	background-color: transparent;
	border-radius: 0.3rem;
	// padding: 0.25rem;
	// margin: 0.1rem 0.15rem;
	.file-icon {
		margin: auto;
	}
}
.file-button svg {
	width: 100%;
	height: 100%;
	fill: currentColor;
}
.file-button:hover {
	background: black;
	color: #fff;
}
</style>
