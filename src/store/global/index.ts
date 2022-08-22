import { defineStore } from "pinia";
import { Names } from "@/store/store-name";
import { ref,computed } from 'vue'

// 使用composition API模式定义  
// 不支持某些内置方法 例如$reset()
// composition API中的ref、reactive定义的变量等价于options API中的state；
// composition API中的computed属性等价于options API中的getters；
// composition API中的导出函数等价于options API中的actions；
export const NaivePiniaComposition=defineStore(Names.NAIVE,()=>{
    // const doubleCount = computed(() => countB.value * 2);

    let $useMessage: any
    let $useNotification: any
    const setUseMessage=(value:any)=> {
        $useMessage = value;
    }
    const setUseNotification=(value:any)=>{
        $useNotification = value;
    }
                                                                  
    return{
        $useMessage,
        $useNotification,
        setUseMessage,
        setUseNotification,
    }
},
{
    persist:{//pinia持久化插件
        enabled:true,//开启持久化
        strategies:[
            {
                storage:localStorage,//默认存储在sessionStorage
                key:`Pinia-${Names.NAIVE}`,//默认为$id
                // paths:['name'],//指定存储,默认为全部
            },
            // {
            //     storage:sessionStorage,
            //     key:`Pinia-${Names.DEMO}`,
            //     paths:['name','id']
            // }
        ]
    }

})