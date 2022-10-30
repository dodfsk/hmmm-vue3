<template>
<div class="creator-container">
    <n-layout has-sider class="creator-layout">
        <n-layout-sider
            class="creator-sider"
            bordered
            show-trigger="bar"
            collapse-mode="width"
            :collapsed-width="64"
            :width="180"
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
            class="creator-content"
        >
                <router-view />
        </n-layout-content>
    </n-layout>
</div>
</template>

<script setup lang='ts'>
import { h, ref, Component, reactive } from 'vue';
import { NIcon } from 'naive-ui';
import {
	HomeOutline,
    BrushOutline,
    FileTrayFullOutline,
    GridOutline,
	SettingsOutline,
    BuildOutline,
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
		icon: renderIcon(GridOutline),
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

];

</script>

<style lang='less' scoped>
.creator-container{
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

.creator-sider{
    height:calc(100vh - 50px);
    // height:100%;
    // overflow:auto;
}
.creator-content{
    max-height:calc(100vh - 50px);
    // height:100%;
    // overflow:auto;
}
:deep(.n-layout-scroll-container){
    overflow:hidden;
}
</style>