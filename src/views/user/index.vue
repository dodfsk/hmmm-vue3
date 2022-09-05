<template>
	<n-layout class="container">
		<n-layout has-sider>
			<n-layout-sider
				bordered
				show-trigger
				collapse-mode="width"
				:collapsed-width="64"
				:width="220"
				:native-scrollbar="false"
				:inverted="inverted"
				style="max-height: 100vh"
			>
				<n-menu
					:inverted="inverted"
					:collapsed-width="64"
					:collapsed-icon-size="22"
					:options="menuOptions"
					:value="route.name"
				/>
			</n-layout-sider>

			<n-layout-content
            class="content"
            >
					<router-view />
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive } from 'vue';
import { NIcon } from 'naive-ui';
import {
	BookOutline as BookIcon,
	HomeOutline,
	PersonOutline as PersonIcon,
	PersonOutline,
	SettingsOutline,
	WineOutline as WineIcon,
} from '@vicons/ionicons5';
import { demoPiniaOptions, demoPiniaComposition } from '@/store/demo';
import { useUserStore } from '@/store/user';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const inverted = ref(true);
const id = ref();

let hmlc_info = ref();
const getUserHmlc = async () => {
	const res = await userStore.USER_GET('hmlc');
	const { code, message, meta, data = {} } = res.data;
	hmlc_info.value = data;
	console.log(hmlc_info);
};

function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user',
						params: {
							lang: 'zh-CN',
						},
					},
				},
				{ default: () => '首页' }
			),
		key: 'user_homepage',
		icon: renderIcon(HomeOutline),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/user/info',
						params: {
							lang: 'zh-CN',
						},
					},
				},
				{ default: () => '个人信息' }
			),
		key: 'user_info',
		icon: renderIcon(PersonOutline),
	},
	{
		label: '发布管理',
		key: 'pinball-1973',
		icon: renderIcon(BookIcon),
		children: [
			{
				label: () =>
					h(
						RouterLink,
						{
							to: {
								path: '/user/publish',
								params: {
									lang: 'zh-CN',
								},
							},
						},
						{ default: () => '我的发布' }
					),
				key: 'user_publish',
			},
		],
	},
	{
		label: '更多设置',
		key: 'dance-dance-dance',
		icon: renderIcon(SettingsOutline),
		children: [
			{
				type: 'group',
				label: '人物',
				key: 'people',
				children: [
					{
						label: '叙事者',
						key: 'narrator',
						icon: renderIcon(PersonIcon),
					},
					{
						label: '羊男',
						key: 'sheep-man',
						icon: renderIcon(PersonIcon),
					},
				],
			},
			{
				label: '饮品',
				key: 'beverage',
				icon: renderIcon(WineIcon),
				children: [
					{
						label: '威士忌',
						key: 'whisky',
					},
				],
			},
			{
				label: '食物',
				key: 'food',
				children: [
					{
						label: '三明治',
						key: 'sandwich',
					},
				],
			},
			{
				label: '过去增多，未来减少',
				key: 'the-past-increases-the-future-recedes',
			},
		],
	},
];
</script>

<style lang="less" scoped>
@import '@/views/root.less';
// .container {
// 	// height: calc(100vh - 42px);
//     // height:100%;
//     // overflow-y: hidden;
// }
// .content{
//     // overflow:scroll;
// 	height: calc(100vh - 42px);
// }
</style>
