import { createPinia } from 'pinia'
import  PiniaPluginPersist  from 'pinia-plugin-persist'//引入pinia持久化插件

const pinia=createPinia()
pinia.use(PiniaPluginPersist)

export default pinia;