import { defineStore } from 'pinia'
import { getRoom,getRoomList,setRoom,delRoom } from "@/api/room"
// import { removeToken } from '@/utils/common/token'
// import { toLogin } from '@/utils/common/auth'
import { Names } from "@/store/store-name";
import { reactive,computed,onMounted } from 'vue'
import { PreSignInfo, Room } from '@/types/room';
import { ImgReplace,ImgToOss,UrlReplace,UrlToOss } from '@/utils/common/ossReplace';
import { cloneDeep } from 'lodash-es'

export const useRoomStore = defineStore(Names.ROOM, ()=>{

    
    const ROOM_LIST=async(query?:object)=> {
        const res = await getRoomList(query)
        const { code,data={}  } = res.data;
        if (code === 200) {
            if(data.roomList){
                data.roomList.forEach((item:Room) => {
                    item.createdAt=new Date(item.createdAt!)
                    if(item.content){
                        item.content=ImgReplace(item.content)//替换img地址
                    }
                });
            }
        }
        return res
    }

    const ROOM_GET=async(id?:string)=> {
        const res = await getRoom(id)
        const { code,data={}  } = res.data;
        if (code === 200) {
            if(data.content){
                data.content=ImgReplace(data.content)//替换img地址
            }
            if(data.assets&&data.assets.length>0){
                data.assets.forEach((item:PreSignInfo)=>{
                    item.url=UrlReplace(item.url)
                })
            }
        }
        return res
    }
    

    const ROOM_SET=async(params:Room)=> {
        const roomState=cloneDeep(params)
        if(roomState.content){
            roomState.content=ImgToOss(roomState.content)
        }
        if(roomState.assets&&roomState.assets.length>0){
            roomState.assets.forEach((item:PreSignInfo)=>{
                item.url=UrlToOss(item.url)
            })
        }
        const res = await setRoom(roomState)
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
        ROOM_LIST,
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
  
