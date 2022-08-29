<template>
	<!-- <div class="nav"> -->
		<n-grid x-gap="12" :cols="24" class="nav">
			<n-gi span="8" class="nav-left">
				<n-menu mode="horizontal" :options="menuOptions" :value="route.meta.title"                />
			</n-gi>

			<n-gi span="8" class="nav-center">


		        <n-input 
                    class="nav-search" 
                    size="small" 
                    v-model:value="searchValue"
                    placeholder="输入搜索"
                    @keyup.enter="handleSearch"
                >
                     <template #suffix>
                        <n-button quaternary circle @click="handleSearch">
                        <n-icon :component="SearchOutline" />

                        </n-button>
                    </template>
                </n-input>


			</n-gi>
            <n-gi span="8" class="nav-right">
                <!-- <div class="circle">
                    <n-icon :component="Person" @click="handleSearch"/>
                    hmlc
                </div> -->
                <!-- <n-switch v-model:value="inverted" />   -->


                <n-popover  
                    placement="bottom-end" 
                    trigger="hover" 
                    :disabled="!userStore?.userInfo?.username"
                    ref="popover" 
                >
                    <template #trigger>
                        
                    <n-button color="#8a2be2" @click="handleUser">
                        <template #icon>
                            <n-icon :component="Person">
                            <cash-icon />
                            </n-icon>
                        </template>
                        {{`${userStore?.userInfo?.username||'未登录'}`}}
                    </n-button>
                    
                    </template>

                    <n-space vertical>
                        <n-button 
                        @click="handleUser"
                        >
                            个人信息
                        </n-button>

                        <n-button 
                        color="green"  
                        @click="handleLogOut"
                        >
                            LogOut
                        </n-button>
                    </n-space>

                </n-popover>

			</n-gi>

		</n-grid>
	<!-- </div> -->
</template>

<script setup lang="ts">
import { h, ref,reactive, Component,onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import type { MenuOption,PopoverProps } from "naive-ui";
import { RouterLink } from "vue-router";
import { HomeOutline, TvOutline, PersonOutline,SearchOutline,Person } from "@vicons/ionicons5";
import {useUserStore} from "@/store/user"

const renderIcon = (icon: Component) => {
	return () => h(NIcon, null, { default: () => h(icon) });
};

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: "home",
						params: {
							lang: "zh-CN",
						},
					},
				},
				{ default: () => "Home" }
			),
		key: "home",
		icon: renderIcon(HomeOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: "hello",
						params: {
							lang: "zh-CN",
						},
					},
				},
				{ default: () => "Hello" }
			),
		key: "hello",
		icon: renderIcon(TvOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: "userInfo",
						params: {
							lang: "zh-CN",
						},
					},
				},
				{ default: () => "User" }
			),
		key: "user",
		icon: renderIcon(PersonOutline),
	},
];

const route = useRoute()
const router = useRouter()
const userStore=useUserStore()
const popover=ref()

console.log('route',route);

let searchValue=ref()

const handleSearch=()=>{
    router.push({
            path: "/search",
            query:{keyword:searchValue.value},
    });
}

const handleUser=()=>{
    console.log('userStore.userInfo',userStore.userInfo);
    if(userStore.userInfo.username!=null){
        router.push({
            path: "/user/info",
        });
    }else if(route.path!=='/user/login'){
        router.push({
            path: "/user/login",
        });
    }
}

const handleLogOut=()=>{
    popover.value.setShow(false)//手动关闭popover
    userStore.logOut()
    router.push({
        path: "/user/login",
    });
}


</script>

<style lang="less" scoped>
.nav {
	width: 100%;
    height:42px;
    padding:0  20px;
	background-color: #fff;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	position: fixed;
    // overflow:hidden;
	top: 0;
	left: 0;
	z-index: 100;
    // margin-bottom: 20px;
	display: flex;
	// justify-content: start;
	&-search {
		width: 300px;
	}
    &-left{
        display: flex;
        justify-content: left;
    }
    &-center{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &-right{
        display: flex;
        justify-content: end;
        align-items: center;
    }
}
.circle{
    margin-right: 50px;
    padding: 3px;
    border: 1px solid #000;
    border-radius: 20px;
}   
.popover-grid {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-gap: 12px;
  justify-content: center;
  align-items: center;
}

.large-text {
  font-size: 24px;
}
</style>
