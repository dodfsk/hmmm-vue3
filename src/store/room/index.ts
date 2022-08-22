import { defineStore } from 'pinia'
import { getRoom,setRoom } from "@/api/room"
// import { removeToken } from '@/utils/token'
// import { toLogin } from '@/utils/auth'
import { Names } from "@/store/store-name";
import { reactive,computed,onMounted } from 'vue'
import { Room } from '@/interface/room';

export const useUserStore = defineStore(Names.USER, ()=>{

    

    const ROOM_SEARCH=async(id:string)=> {

        if(id){
            const res = await getRoom(id)
            const { data={}, status } = res.data;
            // console.log('userInfo',userInfo);
            if (status === '200') {
                // Object.assign(userInfo,data)
                // console.log('userInfo',userInfo);
                //手动存入localStorage方式
                //转换为字符串存入localStorage
                // localStorage.setItem('userInfo',JSON.stringify(userInfo))
            return res
            }
       
        }
    }

    const ROOM_CREATE=async(params:Room)=> {
        const res = await setRoom(params)
        const { status } = res.data;

        return res
    }

    // const loginSave=(params:userType)=>{
    //     Object.assign(userInfo,params)
    // }

    // const logOut=()=> {
    // //   removeToken()
    //     Object.assign(userInfo,init)
    //     localStorage.removeItem('userinfo');
    //     localStorage.removeItem('Pinia-USER');
    //     //   toLogin()
    // }
    // const setUserInfo=(params = {})=> {
    //     // userInfo = { ...userInfo, ...params }
    // }
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
        ROOM_SEARCH,
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
  
