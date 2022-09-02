import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath, URL } from 'url';
// const { resolve } = require('path')

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import  injectPlugin from '@rollup/plugin-inject'
// const inject =require('@rollup/plugin-inject')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			imports: [
				'vue',
				{
					'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
				},
			],
		}),
		Components({
			resolvers: [NaiveUiResolver()], // unplugin-auto-import自动引入
		}),
        injectPlugin({
            'window.Quill': ['@vueup/vue-quill', 'Quill']
        })
	],
	resolve: {
		alias: {
			//   "@": resolve(__dirname, "./src/"),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	// server
	server: {
		hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
		// 服务配置
		port: 3000, // 类型： number 指定服务器端口;
		open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
		cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
		host: '0.0.0.0', // IP配置，支持从IP启动
		proxy: {
			//跨域配置
			'/api': {
				target: 'http://127.0.0.1:13573', // 后台接口
				changeOrigin: true,
				secure: false, // 如果是https接口，需要配置这个参数
				ws: true, //websocket支持
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
