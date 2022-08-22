import { defineStore } from "pinia";
import { Names } from "@/store/store-name";
import { ref,computed } from 'vue'

// 使用options API模式定义
export const demoPiniaOptions=defineStore(Names.DEMO,{
    state:()=>{//存储数据
        return{
            countA:1,
            name:'hmlc',
        }
    },
    
    getters:{//computed 修饰计算 值

    },

    actions:{//methods 同步异步 修改state
        setState(){
            this.countA++
        }
    },

    persist:{//pinia持久化插件
        enabled:true,//开启持久化
        strategies:[
            {
                storage:localStorage,//默认存储在sessionStorage
                key:`Pinia-${Names.DEMO}`,//默认为$id
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

// 使用composition API模式定义  
// 不支持某些内置方法 例如$reset()
// composition API中的ref、reactive定义的变量等价于options API中的state；
// composition API中的computed属性等价于options API中的getters；
// composition API中的导出函数等价于options API中的actions；
export const demoPiniaComposition=defineStore(Names.DEMO_COMPOSITION,()=>{
    const countB = ref<number>(1);
    const doubleCount = computed(() => countB.value * 2);
    const setState=()=> {
        countB.value++;
    }
    return{
        countB,
        setState,
        doubleCount
    }
},
{
    persist:{//pinia持久化插件
        enabled:true,//开启持久化
        strategies:[
            {
                storage:localStorage,//默认存储在sessionStorage
                key:`Pinia-${Names.DEMO_COMPOSITION}`,//默认为$id
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