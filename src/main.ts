import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import pinia from './store/pinia';//.user(piniaStore)
// import naive from 'naive-ui'//手动全部引入

// unplugin-auto-import自动引入
// createApp(App).use(router).use(naive).mount('#app')

const app=createApp(App)


app.use(router)
// app.use(naive)
app.use(pinia)


app.mount('#app')

