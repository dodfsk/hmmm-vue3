<template>
	<n-modal
		preset="card"
		size="small"
		title="Change Password"
		style="width: 650px; min-height: 300px; -webkit-user-drag: none"
	>
		<div class="container">
			<n-form ref="formRef" :model="modelRef" :rules="rules" class="form" >
				<n-form-item path="oldPassword" label="原密码">
					<n-input
						v-model:value="modelRef.oldPassword"
						type="password"
						show-password-on="click"
						placeholder="请输入原密码"
						:allow-input="inputRules.password"
                        :input-props="{
                            autocomplete: 'off'
                        }"
						@keydown.enter.prevent
					/>
				</n-form-item>
				<!-- <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
                    <n-input
                        v-model:value="modelRef.reenteredPassword"
                        :disabled="!modelRef.password"
                        type="password"
                        @input="handlePasswordInput"
                        @keydown.enter.prevent
                    />
                </n-form-item> -->
				<n-form-item path="newPassword" label="新密码">
					<n-input
						v-model:value="modelRef.newPassword"
						type="password"
						placeholder="请输入新密码"
						show-password-on="click"
						:allow-input="inputRules.password"
                        :input-props="{
                            autocomplete: 'off'
                        }"
						@keydown.enter.prevent
					/>
				</n-form-item>
				<n-form-item path="reEnteredPassword" label="确认密码">
					<n-input
						v-model:value="modelRef.reEnteredPassword"
						type="password"
						show-password-on="click"
						placeholder="请二次输入新密码"
						:allow-input="inputRules.password"
                        :input-props="{
                            autocomplete: 'off'
                        }"
						@keydown.enter.prevent
					/>
				</n-form-item>
			</n-form>
		</div>
		<!-- @after-leave="handleCloseModal" -->
		<n-button type="info" v-debounce:click="formValidate" :style="{ float: 'right' }">修改密码</n-button>
	</n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { User } from '@/types/user'
import { ChangePswType, PswFormType } from '@/types/user'
import { useUserStore } from '@/store/user'

// type Props={
//     show:boolean
// }
type Emits = {
	// (e: 'update:show', value: boolean): void //双向绑定show值
	(e: 'handleModalOk', value: boolean): void
}
// const props = defineProps<Props>();
const emits = defineEmits<Emits>()

const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const modelRef = ref<PswFormType>({
	oldPassword: '',
	newPassword: '',
	reEnteredPassword: '',
})
const validatePasswordStartWith = (rule: FormItemRule, value: string): boolean => {
	return (
		!!modelRef.value.newPassword &&
		modelRef.value.newPassword.startsWith(value) &&
		modelRef.value.newPassword.length >= value.length
	)
}
const validatePasswordSame = (rule: FormItemRule, value: string): boolean => {
	return value === modelRef.value.newPassword
}
const rules: FormRules = {
	// username: [
	// 	{
	// 		required: true,
	// 		validator(rule: FormItemRule, value: string) {
	// 			if (!value) {
	// 				return new Error('需要用户名')
	// 			}
	// 			return true
	// 		},
	// 		trigger: ['input', 'blur'],
	// 	},
	// ],
	oldPassword: [
		{
			required: true,
			message: '请输入原密码',
		},
	],
	newPassword: [
		{
			required: true,
			message: '请输入新密码',
		},
	],
	reEnteredPassword: [
		{
			required: true,
			validator: validatePasswordStartWith,
			message: '两次密码输入不一致',
			trigger: ['input', 'blur'],
		},
		{
			validator: validatePasswordSame,
			message: '两次密码输入不一致',
			trigger: ['blur', 'password-input'],
		},
	],
}
const inputRules = {
	// username:(value: string) => !value || /^\w+$/.test(value),
	password: (value: string) => !value || /^[\w!@#$%^&*]+$/.test(value),
}
const formValidate=()=>{

    formRef.value?.validate((errors) => {
		if (!errors) {
			handleChangePsw()
		}
	},(rule)=>{
        // return rule.trigger=='input'
        return rule.required ==true 
    })
}

const handleChangePsw = async () => {
	const param: ChangePswType = {
		oldPassword: modelRef.value.oldPassword,
		newPassword: modelRef.value.newPassword,
	}
	const res = await userStore.USER_CHANGE_PSW(param)
	const { code } = res.data
	if (code == 200) {
		// emits('update:show', false) //双向绑定修改数据
		emits('handleModalOk', false) //双向绑定修改数据
	}
    else{
        window.$message.error('原密码错误')
    }
}
</script>

<style lang="less" scoped>
.container {
	// display: flex;
	// justify-content: space-around;
	// align-items: center;
	// border:1px solid #000;
	// border-radius:.375rem;
	height: 100%;
	padding: 10px 100px;
}
</style>
