<template>
	<n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
		<!-- <n-loading-bar-provider> -->
		<n-dialog-provider>
			<n-notification-provider>
				<n-message-provider>
					<slot></slot>
					<NaiveProviderContent />
					<SpinModal v-if="loadingCount" />
				</n-message-provider>
			</n-notification-provider>
		</n-dialog-provider>
		<!-- </n-loading-bar-provider> -->
	</n-config-provider>
</template>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { zhCN, dateZhCN, GlobalThemeOverrides } from 'naive-ui'
import SpinModal from '@/components/common/SpinModal.vue'

export type UseSpin={
    add:()=>void,
    sub:()=>void,
    reset:()=>void,
}
// import {
//     NaivePiniaComposition
// } from '@/store/global/index'
// const NaivePinia=NaivePiniaComposition()

// NaivePinia.setUseMessage(useMessage())
// NaivePinia.setUseNotification(useNotification())


const loadingCount = ref<number>(0)
const useSpin: UseSpin = {
	add: () => loadingCount.value++,
	sub: () => loadingCount.value--,
    reset:()=>loadingCount.value=0
}

// // 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
	window.$dialog = useDialog()
	window.$notification = useNotification()
	window.$message = useMessage()
	window.$spin = useSpin
}

const NaiveProviderContent = defineComponent({
	setup() {
		setupNaiveTools()
	},
	render() {
		return h('div')
	},
})

const themeOverrides: GlobalThemeOverrides = {
	common: {
		//   primaryColor: '#FF0000'
	},
	Button: {
		//   textColor: '#FF0000'
	},
	Menu: {
		// color:'#000000'
	},
	Layout: {
		// color:'#000000'
	},
}
</script>
