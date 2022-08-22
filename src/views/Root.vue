<template>

	<!-- <n-space vertical> -->
		<!-- <n-space> <n-switch v-model:value="inverted" /> inverted </n-space> -->

		<n-layout>
			<n-layout-header :inverted="inverted"  >
                <div class="nav">
				    <NavTop />
                </div>
			</n-layout-header>

			<n-layout-content>
                <div  class="container">
				    <router-view />
                </div>
			</n-layout-content>

			<n-layout-footer :inverted="inverted" bordered>
				<div class="footer">
                    demo
                </div>
			</n-layout-footer>

		</n-layout>
	<!-- </n-space> -->
</template>

<script setup lang="ts">
import NavTop from "@/components/nav/NavTop.vue";
import {ref} from 'vue'
// import Menu from "@/components/global/menu/Menu.vue";
// import Footer from "@/components/layout/footer/Footer.vue";
const inverted = ref(false);
</script>

<style lang="less" scoped>
// .n-layout-content{
//     // height: 100%;
//     height: 800px;
// }
.nav {
	height: 42px;
}
.container{
// position: block;
    min-height: 90vh;
    height:100%;
    padding: 8px;
    box-sizing: content-box;
	background: url("@/assets/images/login_bg.jpg") repeat;
}
.footer{
    background-color: rgba(103, 244, 103, 0.32);
	box-shadow: 0 0 15px rgba(51, 51, 51, 0.721);
}
</style>
