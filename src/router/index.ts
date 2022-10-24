import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
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
		name: 'room_hv',
		meta: {
			key: 'room',
		},
		component: () => import('@/views/room/hv.vue'),
	},
	{
		path: '/draw',
		name: 'draw',
		meta: {
			key: 'draw',
		},
		component: () => import('@/views/room/draw.vue'),
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
				name: 'user_homepage',
				component: () => import('@/views/user/homepage/homepage.vue'),
			},
			{
				path: 'profile',
				name: 'user_profile',
				component: () => import('@/views/user/myProfile/index.vue'),
			},
            {
				path: 'face',
				name: 'user_face',
				component: () => import('@/views/user/myFace/index.vue'),
			},
			{
				path: 'publish',
				name: 'user_publish',
				component: () => import('@/views/user/myPublish/index.vue'),
			},
			{
				path: 'more',
				name: 'user_more',
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
	history: createWebHashHistory(), //hash模式
	routes,
	scrollBehavior: (_to, _from, savePosition) => {
		console.log('savePosition', savePosition);
		if (savePosition) {
			return savePosition;
		} else {
			if (JSON.stringify(_to.query) == '{}' && JSON.stringify(_from.query) == '{}') {
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
	// console.log('_to, _from, next',_to, _from, next);
    if(to.meta.key=='user'){
    const userStore=useUserStore()
        if(userStore.userInfo.username==null){
            //未登录状态禁止访问user模块
            router.push({
                path:'/user/login'
            })
        }
    }
    // if(_to.meta.key=='user'){
    
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
