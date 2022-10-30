<template>
        <div class="user-container">
            <n-layout has-sider class="user-layout">
                <n-layout-sider
                    class="user-sider"
                    bordered
                    show-trigger="bar"
                    collapse-mode="width"
                    :collapsed-width="64"
                    :width="200"
                    :native-scrollbar="false"
                    :inverted="inverted"
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
                    class="user-content"
                >
                        <router-view />
                </n-layout-content>
            </n-layout>
        </div>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive } from 'vue';
import { NIcon } from 'naive-ui';
import {
	EarthOutline,
    IdCardOutline,
    HappyOutline,
	PersonOutline,
	SettingsOutline,
	WineOutline as WineIcon,
} from '@vicons/ionicons5';

import { useUserStore } from '@/store/user';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const inverted = ref(false);

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
                        // params: {
                        //         lang: 'zh-CN',
                        // },
					},
				},
				{ default: () => '个人空间' }
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
];
</script>

<style lang="less" scoped>

.user-container{
    height:100%;
    width:100%;
    // height: calc(100vh - 50px);
    // max-width:1500px;
    // margin: 0 auto;
    // padding:50px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
}

.user-sider{
    height:calc(100vh - 50px);
    // height:100%;
    // overflow:auto;
}
.user-content{
    max-height:calc(100vh - 50px);
    // height:100%;
    // overflow:auto;
}
:deep(.n-layout-scroll-container){
    overflow:hidden;
}
</style>
