<template>
    <div class="content">
			<n-card class="box">
                <template #header>
                    {{route.params.hv}}
                </template>

                <quill-editor
                    ref="myQuillEditor" 
                    theme="snow" 
                    
                />
                    <!-- v-model="content"  -->
                    <!-- :options="editorOption"  -->
                <!-- <video 
                    src="@/assets/video/test.mp4"
                    class="item"
                    width="640" 
                    height="480"
                ></video> -->

            </n-card>

    </div>
</template>

<script setup lang='ts'>
import { useRoute,useRouter } from 'vue-router';
import  { QuillEditor }  from '@vueup/vue-quill' 
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const route=useRoute()
const router=useRouter()
console.log('route.params.hv',route.params.hv)


</script>

<style lang='less' scoped>
.content{
    width:95%;
    height: 90vh;
    // background-color: #ccc;
    margin:0 auto;
    display: flex;
    justify-content: center;
	align-items: center;
}
.box{
    width:80%;
}
.n-skeleton {
	height: 350px;
	width: 600px;
	border-right: 1px solid #888;
	border-radius: 7px 0 0 7px;
}
</style>