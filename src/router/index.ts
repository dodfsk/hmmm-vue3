import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useUserStore } from '@/store/user';

declare module 'vue-router' {
	interface RouteMeta {
		key: string;
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
			key: 'home',
		},
	},
	{
		path: '/room',
		name: 'room',
		component: () => import('@/views/room/index.vue'),
		meta: {
			key: 'room',
		},
	},
	{
		path: '/room/:id',
		name: 'room-hv',
		meta: {
			key: 'room',
		},
		component: () => import('@/views/room/hv.vue'),
	},
	{
		path: '/search',
		name: 'search',
		meta: {
			key: 'search',
		},
		component: () => import('@/views/search/index.vue'),
	},
    {
		path: '/creator',
		name: 'draw',
		meta: {
			key: 'creator',
		},
		component: () => import('@/views/creator/index.vue'),
        children: [
			{
				path: '',
				name: 'creator-homepage',
				component: () => import('@/views/creator/homepage/index.vue'),
			},
            {
                path: 'draft',
				name: 'creator-draft',
                component: () => import('@/views/creator/draft/index.vue'),
            },
            {
                path: 'draw',
				name: 'creator-draw',
                component: () => import('@/views/creator/draw/index.vue'),
            },
            {
                path: 'publish',
                name: 'creator-publish',
                component: () => import('@/views/creator/publish/index.vue'),
            },
        ]
	},
	{
		path: '/user',
		name: 'user',
		// redirect: '/user/homepage',
		component: () => import('@/views/user/index.vue'),
		meta: {
			key: 'user',
		},
		children: [
			{
				path: '',
				name: 'user-homepage',
				component: () => import('@/views/user/homepage/index.vue'),
			},
			{
				path: 'profile',
				name: 'user-profile',
				component: () => import('@/views/user/profile/index.vue'),
			},
            {
				path: 'face',
				name: 'user-face',
				component: () => import('@/views/user/face/index.vue'),
			},
			{
				path: 'more',
				name: 'user-more',
				component: () => import('@/views/user/component/more.vue'),
			},
		],
	},
	{
		path: '/user/login',
		name: 'login',
		component: () => import('@/views/user/auth/login.vue'),
		meta: {
			key: 'login',
		},
	},
	{
		path: '/user/register',
		name: 'register',
		component: () => import('@/views/user/auth/register.vue'),
		meta: {
			key: 'register',
		},
	},
];

// const HomePage = defineAsyncComponent(
//     () => import(/* webpackChunkName: 'dashboard' */ '@/views/systex/home/home.vue'),
//   );

const router = createRouter({
	history: createWebHistory(), //history模式
	// history: createWebHashHistory(), //hash模式
	routes,
	scrollBehavior: (to, from, savePosition) => {
		console.log('savePosition', savePosition);
		if (savePosition) {
			return savePosition;
		} else {
			if (JSON.stringify(to.query) == '{}' && JSON.stringify(from.query) == '{}') {
				//路由修改query时候不做处理
				return {
					left: 0,
					top: 0,
				};
			}
		}
	}, //滚动行为
});

//NProgress关闭圆形微调器
NProgress.configure({ showSpinner: false });
//路由前置守卫
router.beforeEach(async (to, from, next) => {
	// console.log('-to, -from, next',-to, -from, next);
    if(to.meta.key=='user'||to.meta.key=='creator'){
    const userStore=useUserStore()
        if(!userStore.userInfo.username){
            //未登录状态禁止访问user模块
            router.push({
                path:'/user/login'
            })
        }
    }
    // if(-to.meta.key=='user'){
    
    // }


	if (JSON.stringify(to.query) == '{}' && JSON.stringify(from.query) == '{}') {
		//路由修改query时候不做处理
		NProgress.start(); //开启进度条
	}
	next(); //中间写其他的项目中所需要的一些代码，例如有些网页只有登录了才能进，在这里可以做出判断，判断完了满足要求后就可以放行
});

//路由后置守卫
router.afterEach((_to, _from, _next) => {
	NProgress.done(); //完成进度条
	// window.scrollTo(0, 0)
});

export default router;
