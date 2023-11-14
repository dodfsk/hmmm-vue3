<template>
	<!-- <n-space vertical> -->
	<!-- <n-space> <n-switch v-model:value="inverted" /> inverted </n-space> -->

	<div class="root__container">
	<!-- <n-layout class="container"> -->
		<!-- <n-layout-header :inverted="inverted" class="header"> -->
			<header class="root__header">
			    <NavTop />
			</header>
		<!-- </n-layout-header> -->

		<!-- <n-layout-content class="content"> -->
			<main  class="root__content">
			    <router-view />
			</main>
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
.root__container {
	height: 100%;
	// height: 100vh;
    // overflow: auto;
}
// .n-layout-content {
//     height: 100%;
// }
.root__header {
	height: 50px;
    width:100%;
	// position: -webkit-sticky;
	// position: sticky;
	position: fixed;
    // background-color: rgba(255, 255, 255, 0.98);
	// box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	top: 0px;
	z-index: 250;
}
.root__content {
    // display: flex;
    // flex-direction: column;
	// position: relative;
    // margin:0 auto;
	padding-top: 50px;
    width: auto;
	// min-height: 100%;
	min-height: calc(100% - 50px);
	// height: calc(100% - 50px);
    // height:100%;
    // height:fit-content;//根据内容自适应尺寸
	// box-sizing: content-box;
    // align-items:stretch;
    // flex:1;
	// background: url("@/assets/image/login_bg.jpg") repeat;
	// background:#ccdbe8b0;
    background-color: rgb(246,247,249);
    // overflow: auto;   
    // overflow-y: auto;
    // overflow-y: hidden;
}

// .footer {
// 	text-align: justify(space-around);
// 	// height:24px;
// 	background-color: rgba(115, 255, 190, 0.41);
// 	box-shadow: 0 0 15px rgba(51, 51, 51, 0.721);
// }
</style>

