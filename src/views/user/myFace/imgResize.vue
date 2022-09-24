<template>
        <div id="clipper-container"
        >
        </div>
        <input type="file" id="file" @change="getFile"/>

</template>

<script setup lang='ts'>
import {nextTick,onMounted,ref} from 'vue'
import {ImgResize} from '@/utils/img/imgResize'

let clipper=ref<any>()
let file:File

nextTick(()=>{
    // imgResize=new ImgResize(file,{
    //     container:'#img-container'
    // })
})

const getFile=()=>{
    file = (document.querySelector('#file') as HTMLInputElement).files?.item(0)!;
    clipper.value=new ImgResize(file,{
        container:'#clipper-container',
        width:'800px',
        height:'400px',
    })
    console.log(clipper);
}

</script>

<style lang='less' scoped>
#clipper-container{
    margin:0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    // box-sizing: content-box;
    border:1px solid #ccc;
    // padding:5px;
    min-height:200px;
    overflow: hidden;
}
</style>

