<template>
	<div class="hello">
		<n-space vertical size="large">

			<h1>Hello World</h1>

			<n-button type="info" @click="aref">Link Start</n-button>
            
		</n-space>
	</div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { useRouter } from "vue-router";

// defineProps<{ msg: string }>()
const router = useRouter();
const aref = () => {
	router.push({
		path: "/user/login",
	});
};
</script>

<style lang="less"  scoped>
.hello {
	height: 100%;
    min-height: 80vh;
	display: flex;
	justify-content: center;
	align-items: center;
    
}

</style>
