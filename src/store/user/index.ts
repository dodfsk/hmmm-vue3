import { defineStore } from 'pinia'
import { login,register, setUser,delUser, getUser } from "@/api/user"
import { setToken,getToken,delToken } from '@/utils/auth'
import { Names } from "@/store/store-name";
import { reactive,computed,onMounted } from 'vue'
import { User } from '@/types/user';
// import _ from 'lodash-es'

export const useUserStore = defineStore(Names.USER, ()=>{
    //state
    const init:User = {
        username:null,
        password:null,
    }
    const userInfo=reactive<User>({
        username:null,
        password:null,
    })

    //action
    const USER_LOGIN=async(params:User)=> {
        const res = await login(params)
        const { code,data={} } = res.data;
        if (code === 200) {
            setUserInfo(params)
            setToken(data.token)
        }
        return res.data
    }
    const USER_REG=async(params:User)=> {
        const res = await register(params)
        const { code } = res.data;
        
        // if (code === 200) {
        //     setUserInfo(params)
        // }
        return res.data
    }
    const USER_UPDATE=async(params:User)=> {
        const res = await setUser(params)
        const { code } = res.data;
        
        if (code === 200) {
            setUserInfo(params)
        }
        return res.data
    }
    const USER_DEL=async(params:User)=> {
        const res = await delUser(params)
        const { code } = res.data;
        
        // if (code === 200) {
        //     setUserInfo(params)
        // }
        return res.data
    }
    const USER_GET=async(id:string)=> {
        const res = await getUser(id)
        const { code } = res.data;
        
        if (code === 200) {
            // setUserInfo(params)
        }
        return res.data
    }


    //无接口调用
    const setUserInfo=(params:User)=>{
        userInfo.username=params.username
        // Object.assign(userInfo,params)
        //手动存入localStorage方式
        //转换为字符串存入localStorage
        // localStorage.setItem('userInfo',JSON.stringify(userInfo))
    }
    const logOut=()=> {
        Object.assign(userInfo,init)
        localStorage.removeItem('Pinia-USER');
        delToken();
    }

    //手动存入localStorage方式
    // onMounted(() => {
    //     let obj=localStorage.getItem("userInfo");
    //     if(obj!=null){
    //         userInfo.username=JSON.parse(obj).username
    //         userInfo.password=JSON.parse(obj).password
    //         Object.assign(userInfo,JSON.parse(obj))
    //     }
    // })

    return  {
        userInfo,
        USER_LOGIN,
        USER_REG,
        USER_UPDATE,
        USER_DEL,
        USER_GET,
        logOut,
        setUserInfo,
    }
  },
  {
    persist:{//pinia持久化插件
        enabled:true,//开启持久化
        strategies:[
            {
                storage:localStorage,//默认存储在sessionStorage
                key:`Pinia-${Names.USER}`,//默认为$id
                // paths:['name'],//指定存储,默认为全部
            },
            // {
            //     storage:sessionStorage,
            //     key:`Pinia-${Names.USER}`,
            //     paths:['name','id']
            // }
        ]
    }
  }
  )
  
