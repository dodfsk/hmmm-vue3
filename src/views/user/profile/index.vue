<template>
	<div class="profile-container">
		<div class="profile-box">
			<div class="profile-box__header">
				<n-divider title-placement="left" color="#333">
					<h2>个人资料</h2>
				</n-divider>

				<n-divider title-placement="right" color="#333">
					<n-button type="primary" size="small" v-debounce:click="handleUpdate"> 保存</n-button>
				</n-divider>

				<!-- 
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-start">
                        <n-button type="primary" @click="handleUpdate"> 发 布 </n-button>
                    </div>
                </n-col>
            </n-row> -->
			</div>

			<div class="profile-box__content">
				<n-form ref="formRef" :model="modelRef" :rules="rules" class="form">
					<n-form-item path="uid" label="UID">
						<n-input v-model:value="modelRef.uid" @keydown.enter.prevent disabled />
					</n-form-item>

					<n-form-item path="username" label="用户名">
						<n-input v-model:value="modelRef.username" @keydown.enter.prevent disabled />
					</n-form-item>
					<!-- <n-form-item path="password" label="密码">
                    <n-button type="info" size="small">
                        修改密码
                    </n-button>
                </n-form-item> -->
					<!-- <n-form-item path="password" label="密码">
                    <n-input
                        v-model:value="modelRef.password"
                        type="password"
                        @keydown.enter.prevent
                    />
                </n-form-item> -->
					<!-- <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
                    <n-input
                        v-model:value="modelRef.reenteredPassword"
                        :disabled="!modelRef.password"
                        type="password"
                        @input="handlePasswordInput"
                        @keydown.enter.prevent
                    />
                </n-form-item> -->
					<n-form-item path="phone" label="手机">
						<n-input
							v-model:value="modelRef.phone"
							:allow-input="inputRules.phone"
							@keydown.enter.prevent
						/>
					</n-form-item>
					<n-form-item path="email" label="邮箱">
						<n-input v-model:value="modelRef.email" @keydown.enter.prevent />
					</n-form-item>
					<n-form-item path="birth" label="生日">
						<n-date-picker  v-model:value="modelRef.birth" value-format="yyyy.MM.dd HH:mm:ss" @keydown.enter.prevent />
					</n-form-item>
				</n-form>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive, onMounted, computed } from 'vue'
import {
	FormInst,
	FormItemInst,
	FormItemRule,
	FormRules,
	NIcon,
	UploadCustomRequestOptions,
	UploadFileInfo,
	useMessage,
} from 'naive-ui'
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import { useMinioStore } from '@/store/minio'
import { RouterLink } from 'vue-router'
import { User, UserParam } from '@/types/user'
import { fileToBase64 } from '@/utils/img/imgToBase64'

const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const modelRef = ref<UserParam>({})


const inputRules = {
	phone: (value: string) => !value || /^[0-9]*$/.test(value),
}
const rules: FormRules = {
	username: [
		{
			required: true,
			validator(rule: FormItemRule, value: string) {
				if (!value) {
					return new Error('需要用户名')
				}
				return true
			},
			trigger: ['input', 'blur'],
		},
	],
}

// const handlePasswordInput = () => {
// 	if (modelRef.value.reenteredPassword) {
// 		rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
// 	}
// };

const getUserInfo = async () => {
    window.$spin.add()
	const res = await userStore.USER_GET_MY()
	const { code, message, meta, data } = res.data
	if (code==200) {
	    modelRef.value = data
        window.$spin.sub()
	}
}
const handleUpdate = async () => {
    window.$spin.add()
	const res = await userStore.USER_SET(modelRef.value)
	const { code, message, meta, data } = res.data
    if (code==200) {
        window.$message.success('保存成功')
        window.$spin.sub()
	}
}

onMounted(() => {
	getUserInfo()
})
</script>

<style lang="less" scoped>
// @import '@/views/root.less';
.profile-container {
	// width: 100%;
	height: 100%;
	padding: 20px;
	background-color: #f5f5f5;
	// display:flex;
	// flex-direction: column;
	// align-items: center;
	overflow: auto;
}
.profile-box {
	width: 100%;
	margin: auto;
	// width:fit-content;
	max-width: 960px;
	min-width: 560px;
	padding: 30px;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
	display: flex;
	flex-direction: column;
	align-items: center;
}
// :deep(.n-card__content){
//     width:80%;
//     display:flex;
//     flex-direction: column;
//     align-items: center;
// }
.profile-box__header {
	width: 100%;
	padding: 0 30px;
	// min-width:500px;
	display: flex;
	justify-content: center;
}
.profile-box__content {
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
		max-width: 320px;
	}
}

.n-button {
	min-width: 90px;
}
</style>
