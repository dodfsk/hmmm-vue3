import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import pinia from './store/store';//.user(piniaStore)
// import naive from 'naive-ui'//手动全部引入
// import naive from './ui/naiveui'//手动按需引入naive
// unplugin-auto-import自动引入
// createApp(App).use(router).use(naive).mount('#app')

const app=createApp(App)


app.use(router)
// app.use(naive)
app.use(pinia)


app.mount('#app')

