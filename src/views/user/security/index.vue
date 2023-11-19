<template>
	<div class="security-container">
		<div class="security-box">
			<div class="security-box__header">
				<n-divider title-placement="left" color="#333">
					<h2>账号安全</h2>
				</n-divider>
			</div>

			<div class="security-box__content">
				<n-form ref="formRef" :model="modelRef" class="form">
					<!-- :rules="rules" -->
					<!-- <n-form-item path="uid" label="UID" >
                    <n-input 
                        v-model:value="modelRef.uid" 
                        @keydown.enter.prevent  
                        disabled 
                    />
                </n-form-item> -->

					<!-- <n-form-item path="username" label="用户名" >
                    <n-input 
                        v-model:value="modelRef.username" 
                        @keydown.enter.prevent  
                        disabled 
                    />
                </n-form-item> -->

					<n-form-item path="password" label="密码">
						<n-button type="info" size="medium" @click="showModal = true"> 修改密码 </n-button>
					</n-form-item>

					<n-form-item path="phone" label="手机">
						<n-input v-model:value="modelRef.phone" @keydown.enter.prevent disabled />
						<n-button type="warning" size="medium" disabled> 验证手机 </n-button>
					</n-form-item>
					<n-form-item path="email" label="邮箱">
						<n-input v-model:value="modelRef.email" @keydown.enter.prevent disabled />
						<n-button type="primary" size="medium" disabled> 验证邮箱 </n-button>
					</n-form-item>
				</n-form>
			</div>
		</div>

		<!-- @after-leave="handleCloseModal" -->
	</div>
	<ChangePswModal v-model:show="showModal" ref="pswModalRef" @handleModalOk="handleModalOk"> </ChangePswModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import ChangePswModal from './components/ChangePswModal.vue'
import { User, UserParam } from '@/types/user'

const userStore = useUserStore()
const modelRef = ref<UserParam>({})
const showModal = ref<boolean>(false)

// const rules: FormRules = {
// 	// username: [
// 	// 	{
// 	// 		required: true,
// 	// 		validator(rule: FormItemRule, value: string) {
// 	// 			if (!value) {
// 	// 				return new Error('需要用户名')
// 	// 			}
// 	// 			return true
// 	// 		},
// 	// 		trigger: ['input', 'blur'],
// 	// 	},
// 	// ],
// 	oldPassword: [
// 		{
// 			required: true,
// 			message: '请输入原密码',
// 		},
// 	],
// 	newPassword: [
// 		{
// 			required: true,
// 			message: '请输入新密码',
// 		},
// 	],
// 	reEnteredPassword: [
// 		{
// 			required: true,
// 			message: '请再次输入密码',
// 			trigger: ['input', 'blur'],
// 		},
// 		{
// 			validator: validatePasswordStartWith,
// 			message: '两次密码输入不一致',
// 			trigger: 'input',
// 		},
// 		{
// 			validator: validatePasswordSame,
// 			message: '两次密码输入不一致',
// 			trigger: ['blur', 'password-input'],
// 		},
// 	],
// }

const handleModalOk = async () => {
    window.$message.success('密码修改成功')
    showModal.value=false
}
const getUserInfo = async () => {
    window.$spin.add()
	const res = await userStore.USER_GET_MY()
	const { code, message, meta, data } = res.data
	if (code == 200) {
		modelRef.value = data
        window.$spin.sub()
	}
}
onMounted(() => {
	getUserInfo()
})
</script>

<style lang="less" scoped>
.security-container {
	// width: 100%;
	height: 100%;
	padding: 20px;
	background-color: #e9ecef;
	// display:flex;
	// flex-direction: column;
	// align-items: center;
	overflow: auto;
}
.security-box {
	width: 100%;
	margin: auto;
	max-width: 960px;
	min-width: 560px;
	padding: 30px;
	background-color: #fff;
	border-radius: 5px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.321);
	display: flex;
	flex-direction: column;
	align-items: center;
}
.security-box__header {
	width: 100%;
	padding: 0 30px;
	// min-width:500px;
	display: flex;
	justify-content: center;
}
.security-box__content {
	width: 100%;
	padding-top: 20px;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.form {
		width: 80%;
		min-width: 286px;
	}
	.n-input {
		max-width: 240px;
	}
}
</style>
