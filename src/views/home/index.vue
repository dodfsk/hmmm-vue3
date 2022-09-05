<template>
	<div class="container">
		<n-space vertical size="large" class="hello">

			<h1>Hello World</h1>

			<n-button type="info" @click="aref">Link Start</n-button>
            
		</n-space>
	</div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

// defineProps<{ msg: string }>()
const router = useRouter();
const userStore=useUserStore();

const aref = () => {
    if(userStore.userInfo.username){
        router.push({
            path: "/room",
        });
    }else{
        router.push({
            path: "/user/login",
        });
    }
};
</script>

<style lang="less"  scoped>
@import '@/views/root.less';
.container {
    // min-height: calc(100vh - 42px);
	height: 100%;
    // margin-bottom:auto;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url("@/assets/images/login_bg.jpg") repeat;
    
}
.hello{
	height: 100%;

}

</style>
