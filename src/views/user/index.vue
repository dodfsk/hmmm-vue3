<template>
	<n-layout has-sider class="user-layout-container">
		<n-layout-sider
			class="user-layout-sider"
			collapse-mode="width"
			:collapsed-width="48"
			:width="200"
			bordered
			default-collapsed
			show-trigger="bar"
			:inverted="inverted"
            :native-scrollbar="false"
		>
			<n-menu
				:inverted="inverted"
				:collapsed-width="48"
				:collapsed-icon-size="21"
				:options="menuOptions"
				:value="route.name"
			/>
		</n-layout-sider>

		<n-layout-content class="user-layout-content" >
			<router-view />
		</n-layout-content>
	</n-layout>
    
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive } from 'vue'
import { NIcon } from 'naive-ui'
import {
	EarthOutline,
	IdCardOutline,
	HappyOutline,
	PersonOutline,
	SettingsOutline,
	WineOutline as WineIcon,
	ShieldCheckmarkOutline,
} from '@vicons/ionicons5'

import { useUserStore } from '@/store/user'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const inverted = ref(false)

function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) })
}
const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user',
						// params: {
						//         lang: 'zh-CN',
						// },
					},
				},
				{ default: () => '个人中心' }
			),
		key: 'user-homepage',
		icon: renderIcon(EarthOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user/profile',
					},
				},
				{ default: () => '我的资料' }
			),
		key: 'user-profile',
		icon: renderIcon(IdCardOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user/face',
					},
				},
				{ default: () => '我的头像' }
			),
		key: 'user-face',
		icon: renderIcon(HappyOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user/security',
					},
				},
				{ default: () => '账号安全' }
			),
		key: 'user-security',
		icon: renderIcon(ShieldCheckmarkOutline),
	},
	{
		label: '设置',
		key: 'dance-dance-dance',
		icon: renderIcon(SettingsOutline),
		children: [
			{
				label: '网站设置',
				key: 'beverage',
				icon: renderIcon(WineIcon),
			},
			{
				type: 'group',
				label: '控制台',
				key: 'people',
				children: [
					{
						label: '用户管理',
						key: 'narrator',
						icon: renderIcon(PersonOutline),
					},
					{
						label: '房间管理',
						key: 'sheep-man',
						icon: renderIcon(PersonOutline),
					},
					{
						label: '评论管理',
						key: 'sheep-man',
						icon: renderIcon(PersonOutline),
					},
				],
			},
		],
	},
]
</script>

<style lang="less" scoped>
.user-layout-container {
	// height: 100%;
	width: 100%;
	height: calc(100vh - 50px);
	// max-width:1500px;
	// margin: 0 auto;
	// background-color: #e9ecef;
	// display: flex;
    // flex-wrap: wrap;
	// justify-content: center;
	// align-items: center;
	// overflow:auto;
}

.user-layout-sider {
	// background-color: #fff;
	// height: calc(100vh - 50px);
    // display: flex;
    // width: 180px;
    // flex: 1;
    // width:100%;
	height:100%;
	// overflow:auto;
}
// @media (min-width: 1024px){
//     .user-layout-sider {
//         flex: 0 0 auto;
//         width: 200px;
//         height:100vh;
//     }
// }

.user-layout-content {
    // flex: 1;
	// max-height: calc(100vh - 50px);
	height:100%;
    // width: 800px;
	// overflow:auto;
}
// @media (min-width: 1024px){
//     .user-layout-content {
//         flex: 0 0 auto;
//         width: 800px;
//         height:100%;
//     }
// }

:deep(.n-layout-scroll-container) {
	overflow: hidden;
}
</style>
