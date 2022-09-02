import { defineStore } from 'pinia'
import { delRoom, getRoom,setRoom } from "@/api/room"
// import { removeToken } from '@/utils/token'
// import { toLogin } from '@/utils/auth'
import { Names } from "@/store/store-name";
import { reactive,computed,onMounted } from 'vue'
import { Room } from '@/types/room';

export const useRoomStore = defineStore(Names.ROOM, ()=>{


    const ROOM_GET=async(id?:string)=> {
        const res = await getRoom(id)
        const { code,data={}  } = res.data;
        // console.log('userInfo',userInfo);
        // if (res.status === 200) {
            // Object.assign(userInfo,data)
            // console.log('userInfo',userInfo);
            //手动存入localStorage方式
            //转换为字符串存入localStorage
            // localStorage.setItem('userInfo',JSON.stringify(userInfo))
            // return res.data
        // }
        return res
    }

    const ROOM_SET=async(params:Room)=> {
        const res = await setRoom(params)
        const { code,data={} } = res.data;
        // if (code === 200) {
            return res
        // }
    }

    const ROOM_DEL=async(id:string)=> {
        const res = await delRoom(id)
        const { code,data={} } = res.data;
        // if (code === 200) {
            return res
        // }
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
        ROOM_GET,
        ROOM_SET,
        ROOM_DEL,
    }
  },
  {
    persist:{//pinia持久化插件
        enabled:true,//开启持久化
        strategies:[
            {
                storage:localStorage,//默认存储在sessionStorage
                key:`Pinia-${Names.ROOM}`,//默认为$id
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
  
