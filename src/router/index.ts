import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { useUserStore } from '@/store/user';
import { isLogin } from '@/utils/common/auth'

declare module 'vue-router' {
	interface RouteMeta {
		key: string
	}
}

const routes: Array<RouteRecordRaw> = [
	{
		//根节点
		path: '/',
		alias: '/hello',
		name: 'hello',
		component: () => import('@/views/hello/index.vue'),
		// redirect: {name: 'hello'},
		meta: {
			key: 'hello',
		},
	},
	{
		//主页
		path: '/home',
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
		name: 'room-viewpage',
		meta: {
			key: 'room',
		},
		component: () => import('@/views/room/viewpage.vue'),
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
		name: 'creator',
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
			// {
			//     path: 'draw/:id',
			// 	name: 'creator-draw',
			//     component: () => import('@/views/creator/draw/index.vue'),
			// },
			{
				path: 'publish',
				name: 'creator-publish',
				component: () => import('@/views/creator/publish/index.vue'),
			},
		],
	},
    {
		path: '/usernew',
		name: 'usernew',
		// redirect: '/user/homepage',
		component: () => import('@/views/user/indexNew.vue'),
		meta: {
			key: 'usernew',
		},
        children: [
			{
				path: '',
				name: 'usernew-homepage',
				component: () => import('@/views/user/homepage/index.vue'),
			},
			{
				path: 'profile',
				name: 'usernew-profile',
				component: () => import('@/views/user/profile/index.vue'),
			},
			{
				path: 'face',
				name: 'usernew-face',
				component: () => import('@/views/user/face/index.vue'),
			},
			{
				path: 'security',
				name: 'usernew-security',
				component: () => import('@/views/user/security/index.vue'),
			},
			{
				path: 'more',
				name: 'usernew-more',
				component: () => import('@/views/user/components/more.vue'),
			},
		],
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
				path: 'security',
				name: 'user-security',
				component: () => import('@/views/user/security/index.vue'),
			},
			{
				path: 'more',
				name: 'user-more',
				component: () => import('@/views/user/components/more.vue'),
			},
		],
	},
	{
		path: '/auth/login',
		name: 'auth-login',
		component: () => import('@/views/auth/login.vue'),
		meta: {
			key: 'login',
		},
	},
	{
		path: '/auth/register',
		name: 'auth-register',
		component: () => import('@/views/auth/register.vue'),
		meta: {
			key: 'register',
		},
	},
]

// const HomePage = defineAsyncComponent(
//     () => import(/* webpackChunkName: 'dashboard' */ '@/views/systex/home/home.vue'),
//   );

const router = createRouter({
	history: createWebHistory(), //history模式
	// history: createWebHashHistory(), //hash模式
	routes,
	scrollBehavior: (to, from, savePosition) => {
		console.log('savePosition', savePosition)
		if (savePosition) {
			return savePosition
		} else {
			if (JSON.stringify(to.query) == '{}' && JSON.stringify(from.query) == '{}') {
				//路由修改query时候不做处理
				return {
					left: 0,
					top: 0,
				}
			}
		}
	}, //滚动行为
})

//NProgress关闭圆形微调器
NProgress.configure({ showSpinner: false })
//路由前置守卫
router.beforeEach(async (to, from, next) => {
	// console.log('-to, -from, next',-to, -from, next);
	if (to.meta.key == 'user' || to.meta.key == 'creator') {
		// const userStore=useUserStore()
		if (!isLogin()) {
			//未登录状态禁止访问user模块
			router.push({
				path: '/auth/login',
			})
		}
	}
	// if(-to.meta.key=='user'){

	// }

	if (JSON.stringify(to.query) == '{}' && JSON.stringify(from.query) == '{}') {
		//路由修改query时候不做处理
		NProgress.start() //开启进度条
	}
	next() //中间写其他的项目中所需要的一些代码，例如有些网页只有登录了才能进，在这里可以做出判断，判断完了满足要求后就可以放行
})

//路由后置守卫
router.afterEach((_to, _from, _next) => {
	NProgress.done() //完成进度条
	// window.scrollTo(0, 0)
})

export default router
