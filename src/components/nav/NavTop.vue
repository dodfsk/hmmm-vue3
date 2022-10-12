<template>
	<div class="nav">
        <div class="nav-left">
            <n-icon :component="SparklesSharp" size="24" color="black" style="margin-top:1px" />
			<n-menu mode="horizontal" :options="menuOptions" :value="route.meta.key" />
        </div>
        <!-- <div class="nav-center">
			<n-input
				class="search"
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
        </div> -->
        <div class="nav-right">
			<!-- <div class="circle">
                    <n-icon :component="Person" @click="handleSearch"/>
                    hmlc
                </div> -->
			<!-- <n-switch v-model:value="inverted" />   -->

            <n-input
				class="search"
				v-model:value="searchValue"
				placeholder="输入搜索"
				@keyup.enter="handleSearch"
			>
				<template #suffix>
					<n-button quaternary circle size='tiny' @click="handleSearch">
						<n-icon :component="SearchOutline" />
					</n-button>
				</template>
			</n-input>


			<n-popover placement="bottom" trigger="hover" v-if="userStore?.userInfo?.username" ref="roomPopover">
				<template #trigger>
					<n-button type="info"> 创作中心 </n-button>
				</template>

				<n-space vertical>
					<n-button type="primary" @click="roomDraw"> 绘制 </n-button>
				</n-space>
			</n-popover>

			<n-popover placement="bottom" trigger="hover" :disabled="!userStore?.userInfo?.username" ref="userPopover">
				<template #trigger>
					<n-button color="#8a2be2" v-if="userStore?.userInfo?.username">
						<!-- <template #icon>
							<n-icon :component="Person">
								<cash-icon />
							</n-icon>
						</template> -->

                        <n-avatar
                            :size="28"
                            :src="userStore.userInfo.avatar?OssReplace(userStore.userInfo.avatar)+`?${new Date().getTime()}`:''"
                            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                            object-fit="cover"
                            round
                        />
						{{ `${userStore?.userInfo?.username}` }}
					</n-button>

                    <n-button color="#8a2be2" v-else @click="handleUnlogin">
						{{ `未登录` }}
					</n-button>
				</template>

				<n-space vertical>
					<n-button @click="handleUser"> 个人中心 </n-button>

					<n-button type="error"  @click="handleLogOut"> 登出 </n-button>
				</n-space>
			</n-popover>

        </div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, reactive, Component, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NIcon } from 'naive-ui';
import type { MenuOption, PopoverProps } from 'naive-ui';
import { RouterLink } from 'vue-router';
import {  SparklesSharp, SearchOutline, Person, HomeSharp, Square, Reader } from '@vicons/ionicons5';
import { useUserStore } from '@/store/user';
import { OssReplace } from '@/utils/img/imgReplace';

const renderIcon = (icon: Component) => {
        return () => h(NIcon, {size:"18",style:'margin-top:2px'}, { default: () => h(icon) });
};

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: 'home',
						params: {
							lang: 'zh-CN',
						},
					},
					// replace:true,
                    style:"width:100px"
				},
				{ default: () => 'Home' }
			),
		key: 'home',
		icon: renderIcon(HomeSharp),
	},
	{
		label: () =>
			h(
				// 'a',{
				//     onClick:pushRoom
				// },
				RouterLink,
				{
					to: {
						// name: "room",
						path: '/room',
						params: {
							lang: 'zh-CN',
						},
					},
					// replace:true,
				},
				{ default: () => 'Room' }
			),
		key: 'room',
		icon: renderIcon(Square),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path:'/user',
						params: {
							lang: 'zh-CN',
						},
					},
					// replace:true,
				},
				{ default: () => 'User' }
			),
		key: 'user',
		icon: renderIcon(Reader),
	},
];

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userPopover = ref();
const roomPopover = ref();
const imgSrc=ref<string>('')

console.log('route', route);

let searchValue = ref();

const handleSearch = () => {
	router.push({
		path: '/search',
		query: { keyword: searchValue.value },
	});
};


const handleUnlogin=()=>{
    if (userStore.userInfo.username == null) {
		router.push({
			path: '/user/login',
		});
    }
}

const roomDraw = () => {
	roomPopover.value.setShow(false); //手动关闭popover
	if (userStore.userInfo.username != null) {
        router.push({
            path: `/room/draw`,
        });
    }else{
        router.push({
			path: '/user/login',
		});
    }
};

const handleUser = () => {
	userPopover.value.setShow(false); //手动关闭popover
	console.log('userStore.userInfo', userStore.userInfo);
	if (userStore.userInfo.username != null) {
		router.push({
			path: '/user',
		});
	} else if (route.path !== '/user/login') {
		router.push({
			path: '/user/login',
		});
	}
};

const handleLogOut = () => {
	userPopover.value.setShow(false); //手动关闭popover
	userStore.logOut();
	router.push({
		path: '/user/login',
	});
};

// const pushRoom=()=>{
//     router.push({
//         path: "/room",
//     });
// }

// watch(
//     ()=>userStore.userInfo.avatar,
//     ()=>{
//     if(userStore.userInfo.avatar!=undefined){
//         imgSrc.value=OssReplace(userStore.userInfo.avatar)+`?${new Date().getTime()}`
//         console.log('imgSrc',imgSrc.value);
        
//     }
// })
</script>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@class:.nav;
.scrollbar-to(@class);


.nav {
	width: 100%;
	// height:100%;
	padding: 0 20px;
	// background-color: rgba(255, 255, 255, 0.7);
	// box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	// position: fixed;
	// position:sticky;
	// position:-webkit-sticky;
	overflow:auto;
	// overflow:overlay;
	// top: 42;
	// left: 0;
	// right:0;
	// margin-bottom: 20px;
	display: flex;
	justify-content: space-between;

	&-left {
        // width:33%;
		display: flex;
		justify-content: left;
	}
	// &-center {
    //     // width:33%;
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
    //     :deep(.n-input-wrapper){
    //             padding-right: 0;
    //     }
	// 	.search {
	// 		// max-width: 100px;
    //         min-width:120px;
    //         width:50%;

    //         .n-input__suffix{
    //             .n-button{
    //                 width:10px;
    //              }
    //         }
	// 	}
	// }
	&-right {
        // width:33%;
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 10px;
          :deep(.n-input-wrapper){
                padding-right: 0;
        }
		.search {
			// max-width: 100px;
            min-width:120px;
            // width:50%;

            .n-input__suffix{
                .n-button{
                    min-width:30px;
                }
            }
		}

        // overflow-x: overlay;
        // overflow: overlay;
	}
}
.circle {
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

:deep(.n-menu-item-content){
    padding:0 15px !important;
}
:deep(.n-menu-item-content__icon){
        display: none !important;
}
@media screen and (max-width:520px){
    :deep(.n-menu-item-content){
        padding:0 10px !important;
    }
    :deep(.n-menu-item-content__icon){
        display:inline !important;
    }
    :deep(.n-menu-item-content--header){
        display: none !important;
}
}

.n-button{
    min-width:80px;
}

</style>
