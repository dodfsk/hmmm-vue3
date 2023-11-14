<template>
    <n-spin size="large"  class="spin-modal" >
    </n-spin>
</template>

<script setup lang='ts'>

// import { toRefs,watch } from 'vue'
// type Props = {
// 	show?: boolean
// }
// const props = withDefaults(
//     defineProps<Props>(), {
// 	show: false,
// })

// const { show } = toRefs(props)



</script>

<style lang='less' scoped>

.spin-modal{
    position: fixed; 
    top:0;
    left:0;
    width: 100vw; 
    height: 100vh;
    z-index: 99999;
    background-color: #ffffff70;
}

</style>