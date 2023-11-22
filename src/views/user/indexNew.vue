<template>
	<div class="user-layout-container">
        <div class="user-layout-header">
            <div class="user-title">
                个人中心
            </div>
        </div>
        <div class="user-layout-flexbox">

            <div class="user-layout-sider">
                <n-menu
                    :inverted="inverted"
                    :collapsed="false"
                    :collapsed-width="48"
                    :collapsed-icon-size="21"
                    :options="menuOptions"
                    :value="route.name"
                />
            </div>
            <div class="user-layout-content">
                <router-view />
            </div>
        </div>
	</div>
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
// import axios from '@/utils/axios/demo'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const inverted = ref(false)
const media = window.matchMedia("(max-width: 900px)");

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
						path: '/usernew',
						// params: {
						//         lang: 'zh-CN',
						// },
					},
				},
				{ default: () => '首页' }
			),
		key: 'usernew-homepage',
		icon: renderIcon(EarthOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/usernew/profile',
					},
				},
				{ default: () => '我的资料' }
			),
		key: 'usernew-profile',
		icon: renderIcon(IdCardOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/usernew/face',
					},
				},
				{ default: () => '我的头像' }
			),
		key: 'usernew-face',
		icon: renderIcon(HappyOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/usernew/security',
					},
				},
				{ default: () => '账号安全' }
			),
		key: 'usernew-security',
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
	min-height: calc(100vh - 50px);
	// min-height: 100%;
	width: 100%;
	// height: calc(100vh - 50px);
	// max-width:1500px;
	// margin: 0 auto;
	background-color: #e9ecef;
    // display: inline-block;
	// display: flex;
	// flex-wrap: wrap;
	// justify-content: center;
	// align-items: center;
    // overflow: auto;
}
.user-layout-header{
    width: 860px;
    margin:0 auto;
}
.user-layout-flexbox{
    display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
.user-layout-sider {
	background-color: #fff;
	// height: calc(100vh - 50px);
	// position: sticky;
	// top: 50px;
	// background-color: #fff;
	// flex: 1;
	width: 200px;
	height: 100%;
	// overflow:auto;
}
@media (max-width: 880px) {
	.user-layout-sider {
		// flex: 0 0 auto;
		width: 100%;
	}
}

.user-layout-content {
	// flex: 1;
	// min-height: 100%;
	// min-height: calc(100vh - 50px);
	background-color: #fff;
	// height:100%;
    width: 100% ;
    max-width: 660px;
	min-width: 360px;
	// overflow:auto;
}
@media (max-width: 880px){
    .user-layout-content {
        // flex: 0 0 auto;
        height:100%;
        // max-width: 880px;
	    // max-width: 100%;
    }
}

:deep(.n-layout-scroll-container) {
	overflow: hidden;
}
</style>
