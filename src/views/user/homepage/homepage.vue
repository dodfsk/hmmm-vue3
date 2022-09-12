<template>
<div class="container">
    homepage
    主页
    {{b}}
    <div class="div1"></div>
    <n-input
    v-model:value="a"
    >

    </n-input>
    <n-button
    @click="handleChange"
    >
    改变
    </n-button>
    <!-- <n-skeleton style="height:10000px;background-color: blueviolet;" />
     -->
</div>
</template>

<script setup lang='ts'>
import { ref  } from 'vue'

const a=ref<string>('a')
const b=ref<string>('a')

// setTimeout(()=>{
// a.value='1231231231232'
// },2000)

const handleChange=()=>{
    // a.value='12312412'
    b.value=a.value
    let c=document.querySelector('.div1')
    console.log(c);
    // c?.setAttribute('')
}

</script>

<style lang='less' scoped>
.container{
    padding: 40px;
    // display:flex;
    // flex-direction: column;
    // align-items: center;
}

</style>