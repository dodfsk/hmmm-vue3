import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

declare module 'vue-router' {
	interface RouteMeta {
		title: string;
	}
}

const routes: Array<RouteRecordRaw> = [
	{
		//根节点
		path: '/',
		alias: '/home',
		name: 'home',
		component: () => import('@/views/home/index.vue'),
		// redirect: {name: 'home'},
		meta: {
			title: 'home',
		},
	},
    {
		path: '/room',
		name: 'room',
		component: () => import('@/views/room/index.vue'),
		meta: {
			title: 'room',
		},
	},
	{
		path: '/room/:hv',
		name: 'hv',
		meta: {
			title: 'room',
		},
		component: () => import('@/views/room/hv.vue'),
	},
    {
		path: '/room/draw',
		name: 'room_draw',
		meta: {
			title: 'room',
		},
		component: () => import('@/views/room/draw.vue'),
	},
	{
		path: '/search',
		name: 'search',
		meta: {
			title: 'search',
		},
		component: () => import('@/views/room/hv.vue'),
	},
	{
		path: '/hello',
		name: 'hello',
		component: () => import('@/components/HelloWorld.vue'),
		meta: {
			title: 'hello',
		},
		children: [],
	},
	{
		path: '/user',
		name: 'user',
		redirect: '/user/login',
		meta: {
			title: 'user',
		},
		children: [
			{
				path: '/user/info',
				name: 'userInfo',
				component: () => import('@/views/user/info.vue'),
			},
			{
				path: '/user/login',
				name: 'login',
				component: () => import('@/views/user/login.vue'),
			},
			{
				path: '/user/register',
				name: 'register',
				component: () => import('@/views/user/register.vue'),
			},
		],
	},
];

// const HomePage = defineAsyncComponent(
//     () => import(/* webpackChunkName: 'dashboard' */ '@/views/systex/home/home.vue'),
//   );

const router = createRouter({
	history: createWebHashHistory(), //hash模式
	routes,
	scrollBehavior: (_to, _from, savePosition) => {
		console.log('savePosition', savePosition);

		if (savePosition) {
			return savePosition;
		} else {
			return {
				top: 0,
			};
		}
	}, //滚动行为
});

//NProgress关闭圆形微调器
NProgress.configure({ showSpinner: false });
//路由前置守卫
router.beforeEach(async (_to, _from, next) => {
    // console.log('_to, _from, next',_to, _from, next);
    if(JSON.stringify(_to.query)=='{}'&&JSON.stringify(_from.query)=='{}'){
	    NProgress.start(); //开启进度条
    }
	next(); //中间写其他的项目中所需要的一些代码，例如有些网页只有登录了才能进，在这里可以做出判断，判断完了满足要求后就可以放行
});

//路由后置守卫
router.afterEach((_to) => {
	NProgress.done(); //完成进度条
});

export default router;
