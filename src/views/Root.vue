<template>
	<!-- <n-space vertical> -->
	<!-- <n-space> <n-switch v-model:value="inverted" /> inverted </n-space> -->

	<div class="container">
	<!-- <n-layout class="container"> -->
		<!-- <n-layout-header :inverted="inverted" class="header"> -->
			<div class="header">
			<NavTop />
			</div>
		<!-- </n-layout-header> -->

		<!-- <n-layout-content class="content"> -->
			<div  class="content">
			<router-view />
			</div>
		<!-- </n-layout-content> -->

		<!-- <n-layout-footer :inverted="inverted" bordered class="footer"> -->
		<!-- <div class="footer"> -->
		<!-- demo -->
		<!-- </div> -->
		<!-- </n-layout-footer> -->
	<!-- </n-layout> -->
	</div>
	<!-- </n-space> -->
</template>

<script setup lang="ts">
import NavTop from '@/components/nav/NavTop.vue';
import { onMounted, ref } from 'vue';
// import Menu from "@/components/global/menu/Menu.vue";
// import Footer from "@/components/layout/footer/Footer.vue";
const inverted = ref(false);

onMounted(()=>{
    // let scrollContainer=document.querySelectorAll('.n-layout-scroll-container')
})
</script>

<style lang="less" scoped>
// .container {
// 	// height: 100%;
// 	// height: 100vh;
//     overflow: auto;
// }
// .n-layout-content {
//     height: 100%;
// }
.header {
	// height: 42px;
	// height:100%;
	position: sticky;
	position: -webkit-sticky;
    background-color: rgba(255, 255, 255, 0.7);
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	top: 0px;
	z-index: 250;
}
.content {
	// position: block;
	// min-height: 100%;
	// min-height: calc(100% - 66px);
	// height: calc(100vh - 42px);
    // height:100%;
    // height:fit-content;//根据内容自适应尺寸
	box-sizing: content-box;
    // align-items:stretch;
    // flex:1;
	// background: url("@/assets/images/login_bg.jpg") repeat;
	// background:#ccdbe8b0;
	background: #6494be85;
    // overflow: auto;   
    // overflow-y: auto;
    // overflow-y: hidden;
}

.footer {
	text-align: justify(space-around);
	// height:24px;
	background-color: rgba(115, 255, 190, 0.41);
	box-shadow: 0 0 15px rgba(51, 51, 51, 0.721);
}
</style>
