<template>
	<div class="container">
		<div class="box">
			<n-skeleton />
			<n-card class="n-card-login" title="登录面板">
				<n-form ref="formRef" :model="userState" :rules="rules" :show-require-mark="false">
					<n-form-item label="账号:" path="username">
						<n-input
							v-model:value="userState.username"
							placeholder="你的用户名"
							@keyup.enter="validateAction"
						/>
					</n-form-item>
					<n-form-item label="密码:" path="password">
						<n-input
							v-model:value="userState.password"
							type="password"
							show-password-on="mousedown"
							placeholder="密码"
							@keyup.enter="validateAction"
						/>
					</n-form-item>

					<n-space justify="space-evenly">
						<n-button type="primary" @click="validateAction"> 登录 </n-button>
						<n-button @click="handleReg"> 注册 </n-button>
					</n-space>
				</n-form>
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { login } from "@/api/user/demo"
import { useUserStore } from '@/store/user'
import { debounce } from 'lodash-es'
import { FormItemRule, FormRules, FormInst } from 'naive-ui'

const router = useRouter()
const { USER_LOGIN } = useUserStore()

const formRef = ref<FormInst | null>(null)

interface loginType {
	username?: string
	password?: string
}

const userState = reactive<loginType>({
	username: undefined,
	password: undefined,
})
// let { username, password } = toRefs(userState);

const rules: FormRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: ['input'],
		},
	],
	password: [
		{
			required: true,
			message: '请输入密码',
			trigger: ['input'],
			//blur
		},
	],
}

const validateAction = () => {
	formRef.value?.validate((errors) => {
		if (!errors) {
			handleLogin()
		}
	})
}

const handleLogin = debounce(
	async () => {
		// const res=await login(userState)
		const res = await USER_LOGIN(userState)
		const { code, message, meta } = res.data
		if (code == 200) {
			// window.$notification.success({
			//     title:'success',
			//     content:message||'登录成功!',
			//     meta:meta||`欢迎,${userState.username}`,
			//     duration: 3000,
			// })
			router.push({
				path: '/user',
			})
		}
	},
	800,
	{
		leading: true,
		trailing: false,
	}
)

const handleReg = () => {
	router.push({
		path: '/user/register',
	})
}
</script>

<style lang="less" scoped>
@import '@/views/root.less';
.container {
	height: 100%;
	// width:100%;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url('@/assets/images/login_bg.jpg') repeat;
}
.box {
	display: flex;
	justify-content: center;
	align-items: center;
	width: calc(100vw - 100px);
	height: calc(100vh - 100px);
	min-width: 350px;
	min-height: 400px;
	overflow-x: auto;
	// background-color: rgba(100, 148, 237, 0.4);
	border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);

	background: -webkit-linear-gradient(45deg, rgba(87, 213, 91, 0.4), rgba(0, 0, 255, 0.4)); /* Safari 5.1 - 6.0 */

	background: -o-linear-gradient(45deg, rgba(87, 213, 91, 0.4), rgba(0, 0, 255, 0.4)); /* Opera 11.1 - 12.0 */

	background: -moz-linear-gradient(45deg, rgba(87, 213, 91, 0.4), rgba(0, 0, 255, 0.4)); /* Firefox 3.6 - 15 */

	background: linear-gradient(45deg, rgba(87, 213, 91, 0.4), rgba(0, 0, 255, 0.4)); /* 标准的语法（必须放在最后） */
}
.n-card {
	&-login {
		width: 350px;
		height: 350px;
		min-width: 350px;
		min-height: 350px;
		border-radius: 0 7px 7px 0;
	}
}
.n-skeleton {
	min-height: 350px;
	min-width: 600px;
	width: 600px;
	// border-right: 1px solid #888;
	border-radius: 7px 0 0 7px;
}
@media screen and (max-width: 1050px) {
	.n-card-login {
		width: 350px;
		height: 350px;
		min-width: 350px;
		min-height: 350px;
		border-radius: 7px;
	}
	.n-skeleton {
		display: none;
	}
}
@media screen and (max-width: 520px) {
	.box {
		width: 400px;
		height: 400px;
		min-width: 400px;
		min-height: 400px;
	}
}

.n-button {
	width: 90px;
}
</style>
