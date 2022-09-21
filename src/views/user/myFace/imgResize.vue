<template>
    <div id="img-container">
    </div>
    <input type="file" id="file" @change="getFile"/>

</template>

<script setup lang='ts'>
import {nextTick,onMounted} from 'vue'
import {ImgResize} from '@/utils/img/imgResize'

let imgResize:any
let file:File

nextTick(()=>{
    // imgResize=new ImgResize(file,{
    //     container:'#img-container'
    // })
})

const getFile=()=>{
    file = (document.querySelector('#file') as HTMLInputElement).files?.item(0)!;
    imgResize=new ImgResize(file,{
        container:'#img-container',
        width:'100%',
        height:'500px',
    })
    console.log(imgResize);
}

</script>

<style lang='less' scoped>
#img-container{
    margin:0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    border:1px solid #000;
    padding:5px;
    min-height:200px;
    overflow: auto;
}
</style>

