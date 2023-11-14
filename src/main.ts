import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import pinia from './store/pinia' //.user(piniaStore)
// import naive from 'naive-ui'//手动全部引入
// unplugin-auto-import自动引入

import { useDebounceDirective, useThrottleDirective } from '@/utils/directives/instruction' //引入自定义指令-节流防抖

const app = createApp(App)

app.use(router)
// app.use(naive)
app.use(pinia)

app.directive('debounce', useDebounceDirective(800))
app.directive('throttle', useThrottleDirective(2000))

app.mount('#app')
