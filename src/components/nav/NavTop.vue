<template>
	<div class="nav">
		<div class="nav-left">
			<n-icon :component="SparklesSharp" size="24" color="black" style="margin-top: 1px" />
			<n-menu class="nav-menu" mode="horizontal" :options="menuOptions" :value="route.meta.key" />
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
				clearable
			>
				<template #suffix>
					<n-button quaternary circle size="tiny" @click="handleSearch">
						<n-icon :component="SearchOutline" />
					</n-button>
				</template>
			</n-input>

			<n-popover
				placement="bottom"
				trigger="hover"
				:disabled="!userStore?.userInfo?.username"
				ref="userPopover"
				:scrollable="true"
			>
				<template #trigger>
					<div class="nav-avatar">
						<n-avatar
							class="nav-face"
							:size="38"
							:src="
								userStore.userInfo?.avatar ??
								'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
							"
							fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
							round
							@click="handleUser('/face')"
						/>
					</div>
				</template>

				<!-- <n-space vertical> -->
				<div class="nav-popover-user">
					<n-button quaternary v-if="userStore?.userInfo?.username" @click="handleUser('/profile')">
						{{ `${userStore?.userInfo?.username}` }}
					</n-button>

					<n-button quaternary @click="handleUser()"> 个人空间 </n-button>

					<n-button color="#000" @click="handleLogOut" style="margin-top: 10px">
						<n-icon :size="20" :component="LogOutOutline" />
						<div style="padding-right: 8px">登出</div>
					</n-button>
				</div>
				<!-- </n-space> -->
			</n-popover>

			<n-popover
				placement="bottom"
				trigger="hover"
				:disabled="!userStore?.userInfo?.username"
				ref="creatorPopover"
				:scrollable="true"
				content-style="padding: 10px"
			>
				<template #trigger>
					<n-button type="info" @click="handleCreator()">
						<n-icon size="16" :component="BulbOutline" />
						创作中心
					</n-button>
				</template>

				<div class="nav-popover-creator">
					<n-button quaternary @click="handleCreator('/publish')">
						<div>发布管理</div>
					</n-button>
					<n-button quaternary @click="handleCreator('/draft')"> 草稿箱</n-button>
					<n-button quaternary @click="handleCreator('/draw')"> 绘制 </n-button>
				</div>
			</n-popover>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h, ref, reactive, Component, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import type { MenuOption, PopoverProps } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
	LogOutOutline,
	BulbOutline,
	SparklesSharp,
	SearchOutline,
	Person,
	HomeSharp,
	Square,
	Reader,
	AlbumsOutline,
	FileTrayFullOutline,
	BrushOutline,
} from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import { UrlReplace } from '@/utils/common/ossReplace'

const renderIcon = (icon: Component) => {
	return () => h(NIcon, { size: '18', style: 'margin-top:2px' }, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: 'home',
						// params: {
						// 	lang: 'zh-CN',
						// },
					},
					// replace:true,
					style: 'width:100px',
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
					},
					// replace:true,
				},
				{ default: () => 'Room' }
			),
		key: 'room',
		icon: renderIcon(Square),
	},
	// {
	// 	label: () =>
	// 		h(
	// 			RouterLink,
	// 			{
	// 				to: {
	// 					path: '/user',
	// 				},
	// 				// replace:true,
	// 			},
	// 			{ default: () => 'User' }
	// 		),
	// 	key: 'user',
	// 	icon: renderIcon(Reader),
	// },
]

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const userPopover = ref()
const creatorPopover = ref()
// const imgSrc = computed(() => {
//     if(userStore.userInfo)
//         return userStore.userInfo.avatar
//     else
//         return
// })

console.log('route', route)

let searchValue = ref()

const handleSearch = () => {
	router.push({
		path: '/search',
		query: { keyword: searchValue.value },
	})
}

const handleCreator = (path: string = '') => {
	creatorPopover.value.setShow(false) //手动关闭popover
	router.push({
		path: `/creator${path}`,
	})
}

const handleUser = (path: string = '') => {
	userPopover.value.setShow(false) //手动关闭popover
	router.push({
		path: `/user${path}`,
	})
}

const handleLogOut = () => {
	userPopover.value.setShow(false) //手动关闭popover
	userStore.logOut()
	// router.push({
	// 	path: '/auth/login',
	// });
}

// const pushRoom=()=>{
//     router.push({
//         path: "/room",
//     });
// }
</script>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@class: .nav;
.scrollbar-to(@class);

.nav {
	width: 100%;
	height: 50px;
	padding: 0 20px;
	z-index: 999;
	background-color: rgba(255, 255, 255, 0.98);
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.421);
	// position: fixed;
	// position:sticky;
	// position:-webkit-sticky;
	overflow: auto;
	overflow: overlay;
	overflow-x: overlay;
	overflow-y: hidden;
	// top: 42;
	// left: 0;
	// right:0;
	// margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
}
.nav-left {
	display: flex;
	justify-content: left;
	// align-items: center;
}
.nav-menu {
	align-items: center;
}

.nav-right {
	// width:50%;
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 20px;
	:deep(.n-input-wrapper) {
		padding-right: 5px;
	}
	.search {
		// width: 240px;
		min-width: 155px;
		// max-width:300px;
		// width:50%;
		user-select: none;

		.n-input__suffix {
			.n-button {
				min-width: 20px;
			}
		}
	}

	// overflow-x: overlay;
	// overflow: overlay;
}

.nav-popover-user {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.n-button {
		width: 120px;
	}
}
.nav-popover-creator {
	display: flex;
	// flex-direction: column;
	// justify-content: center;
	// align-items: center;
	.n-button {
		width: 80px;
		height: 64px;
	}
}
.nav-avatar{
    width: 38px;
    height: 38px;
    .nav-face {
        padding: 0;
        margin: 0;
        user-select: none;
        outline: 1px solid #e4edf4;
    }
}

// .popover-grid {
// 	display: grid;
// 	grid-template-columns: auto auto auto auto auto;
// 	grid-gap: 12px;
// 	justify-content: center;
// 	align-items: center;
// }

.large-text {
	font-size: 24px;
}

:deep(.n-menu-item-content) {
	padding: 0 15px !important;
	user-select: none;
}
:deep(.n-menu-item-content__icon) {
	display: none !important;
}
@media screen and (max-width: 520px) {
	:deep(.n-menu-item-content) {
		padding: 0 5px !important;
	}
	:deep(.n-menu-item-content__icon) {
		display: inline !important;
	}
	:deep(.n-menu-item-content--header) {
		display: none !important;
	}
	.nav {
		height: 56px;
	}
}

// .n-button {
// 	min-width: 80px;
// }
</style>
