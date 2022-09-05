<template>
    <AppProvider>

        <Root />
        <!-- <router-view/> -->
        
    </AppProvider>
</template>

<script setup lang="ts">
import AppProvider from '@/components/global/AppProvider.vue'
import Root from '@/views/Root.vue'
// import { onMounted } from 'vue';

/**主title */
document.title='hmmm'

</script>

<style lang="less">
* {
	padding: 0;
	margin: 0;
    box-sizing: border-box;
}
html,body,#app{
	height: 100%;
    // overflow: hidden;
    // overflow-y: overlay;
    .n-config-provider {
        height: inherit;
    }
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
#nprogress .bar {
	background: rgb(35, 186, 35) !important; /* 这里可以修改进度条颜色 */
	height: 3px !important;
}
.n-input {
	text-align: left;
}

</style>
