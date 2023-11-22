<template>
	<n-layout has-sider class="creator-layout-container" >
		<n-layout-sider
			class="creator-layout-sider"
			collapse-mode="width"
			:collapsed-width="48"
			:width="200"
			bordered
			default-collapsed
			show-trigger="bar"
			:inverted="inverted"
		>
			<n-menu
				:inverted="inverted"
				:collapsed-width="48"
				:collapsed-icon-size="21"
				:options="menuOptions"
				:value="route.name"
			/>
		</n-layout-sider>

		<n-layout-content class="creator-layout-content">
			<router-view />
		</n-layout-content>
	</n-layout>
</template>

<script setup lang="ts">
import { h, ref, Component, reactive } from 'vue'
import { NIcon } from 'naive-ui'
import {
	HomeOutline,
	BrushOutline,
	FileTrayFullOutline,
	AlbumsOutline,
	SettingsOutline,
	BuildOutline,
	WineOutline as WineIcon,
} from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const inverted = ref(false)
const containerRef=ref()
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
						path: '/creator',
						// params: {
						//         lang: 'zh-CN',
						// },
					},
				},
				{ default: () => '首页' }
			),
		key: 'creator-homepage',
		icon: renderIcon(HomeOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/creator/draw',
						// params: {
						//         lang: 'zh-CN',
						// },
					},
				},
				{ default: () => '绘制' }
			),
		key: 'creator-draw',
		icon: renderIcon(BrushOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/creator/draft',
						// params: {
						//         lang: 'zh-CN',
						// },
					},
				},
				{ default: () => '草稿箱' }
			),
		key: 'creator-draft',
		icon: renderIcon(FileTrayFullOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/creator/publish',
					},
				},
				{ default: () => '发布管理' }
			),
		key: 'creator-publish',
		icon: renderIcon(AlbumsOutline),
	},
	{
		label: '设置',
		key: 'dance-dance-dance',
		icon: renderIcon(BuildOutline),
		children: [
			{
				label: '测试1',
				key: 'beverage',
				icon: renderIcon(WineIcon),
				children: [
					{
						label: '测试2',
						key: 'whisky',
					},
				],
			},
		],
	},
]
</script>

<style lang="less" scoped>
//naiveui限制,折叠菜单只能在layout中使用,无法很好的使用最外层滚动条

.creator-layout-container {
	width: 100%;
	// height: 100%;//继承父类高度,使用最外层的滚动条
	height: calc(100vh - 50px);//通过vh限制窗口高度,使用内部的滚动条
	// max-width:1500px;
	// margin: 0 auto;
	// padding:50px;
	// display: flex;
	// justify-content: center;
	// align-items: center;
	// overflow:auto;
}
.creator-layout-sider {
	height:100%;
	// height: calc(100vh - 50px);
    // position: fixed;
    // top:0;
	// height:100%;
	// overflow:auto;
}
.creator-layout-content {
	height:100%;
	background: #e9ecef;
    // padding-left: 48px;
	// min-height: calc(100% - 50px);
	// max-height: calc(100vh - 50px);
	// overflow:auto;
}
// :deep(.n-layout-scroll-container) {
// 	overflow: hidden;
// }
</style>
