import { defineStore } from 'pinia'
import { login,register, setUser,delUser } from "@/api/user"
// import { removeToken } from '@/utils/token'
// import { toLogin } from '@/utils/auth'
import { Names } from "@/store/store-name";
import { reactive,computed,onMounted } from 'vue'
import { User } from '@/interface/user';

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
        const { status } = res.data;
        if (status === '200') {
            setUserInfo(params)
        }
        return res
    }

    const USER_REG=async(params:User)=> {
        const res = await register(params)
        const { status } = res.data;
        
        if (status === '200') {
            setUserInfo(params)
        }
        return res
    }

    const USER_UPDATE=async(params:User)=> {
        const res = await setUser(params)
        const { status } = res.data;
        
        if (status === '200') {
            setUserInfo(params)
        }
        return res
    }
    const USER_DEL=async(params:User)=> {
        const res = await delUser(params)
        const { status } = res.data;
        
        if (status === '200') {
            setUserInfo(params)
        }
        return res
    }


    //无接口调用
    const setUserInfo=(params:User)=>{
        Object.assign(userInfo,params)
            //手动存入localStorage方式
            //转换为字符串存入localStorage
            // localStorage.setItem('userInfo',JSON.stringify(userInfo))
    }
    const logOut=()=> {
    //   removeToken()
        Object.assign(userInfo,init)
        localStorage.removeItem('userinfo');
        localStorage.removeItem('Pinia-USER');
        //   toLogin()
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
  
