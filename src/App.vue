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
document.title = 'hmmm'
</script>

<style lang="less">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
html,
body,
#app {
	height: 100%;
	// overflow: hidden;
	// overflow-y: overlay;
	.n-config-provider {
		height: inherit;
	}
}
#app {
	font-family: -apple-system, Microsoft YaHei, sans-serif, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial,
		PingFang SC, Hiragino Sans GB;

	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
#nprogress .bar {
	background: rgb(35, 186, 35) !important; /* 这里可以修改进度条颜色 */
	height: 3px !important;
}
</style>
