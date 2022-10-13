<template>
	<div class="container">
		<n-space vertical size="large">

			<h1  class="hello">Hello World</h1>

			<n-button type="info" @click="aref" class="button">Link Start</n-button>
            
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
@import '@/utils/less/animation.less';

.container {
    // min-height: calc(100vh - 42px);
	height: 100%;
    // margin-bottom:auto;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url("@/assets/images/login_bg.jpg") repeat;
    text-align: center;
}

.hello{
    font-size: 32px;
    animation: helloWorld 0.8s ease-out;
}
.keyframes (all,helloWorld,{
    from {
        transform:translateY(-50px),
    }
    to {
        transform:translateY(0px),
    }
});

.button{
    // animation-delay:0.5s;
    // -webkit-animation-delay:0.5s; /* Safari 和 Chrome */
    animation: showButton 1.2s ease-out;
}
.keyframes (all,showButton,{
    from {
        // letter-spacing:-0.5em,
        // transform: scaleX(0),
        opacity:0
    }
    to {
        // letter-spacing:initial,
        opacity:1
        // transform: scaleX(1)
    }
});

// .button:hover{
//     animation: changeBorder 0.9s ease-out;
// }
// .keyframes (all,changeBorder,{
//     from {
//         border: 1px solid black;
//     }
//     to {
//         border: 1px solid black;
//     }
// });//混合函数加分号

</style>
