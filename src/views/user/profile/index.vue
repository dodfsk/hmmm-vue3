<template>
	<div class="container">
        <div class="card">

        <div class="header">
            <div class="header-left">
                <h2>我的资料</h2>
                <hr>
            </div>
            <n-button type="primary" @click="handleUpdate"> 修 改</n-button>
        <!-- 
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-start">
                        <n-button type="primary" @click="handleUpdate"> 发 布 </n-button>
                    </div>
                </n-col>
            </n-row> -->

        </div>

        <div class="content">

            <n-form ref="formRef" :model="modelRef" :rules="rules" class="form">
                <n-form-item path="username" label="用户名" >
                    <n-input 
                        v-model:value="modelRef.username" 
                        @keydown.enter.prevent  
                        disabled 
                    />
                </n-form-item>
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
                        @keydown.enter.prevent
                        style="min-width: 50%"
                        autosize
                    />
                </n-form-item>
                <n-form-item path="email" label="邮箱">
                    <n-input
                        v-model:value="modelRef.email"
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-form-item path="birth" label="生日">
                    <n-date-picker
                        v-model:value="modelRef.birth"
                        @keydown.enter.prevent
                    />
                </n-form-item>


            </n-form>
   
        </div>

        </div>

	</div>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive, onMounted, computed } from 'vue';
import { FormInst, FormItemInst, FormItemRule, FormRules, NIcon, UploadCustomRequestOptions, UploadFileInfo, useMessage } from 'naive-ui';
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5';
import { demoPiniaOptions, demoPiniaComposition } from '@/store/demo';
import { useUserStore } from '@/store/user';
import {useMinioStore} from '@/store/minio';
import { RouterLink } from 'vue-router';
import { User } from '@/types/user';
import { fileToBase64 } from '@/utils/img/imgToBase64';
import { imgCompress } from '@/utils/img/imgCompress';

const inverted = ref(true);

const userStore = useUserStore();

const loading=ref(true)
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const modelRef = ref<User>({});
const imgSrc=ref<string>('')



const  validatePasswordStartWith=(rule: FormItemRule, value: string): boolean =>{
	return (
		!!modelRef.value.password &&
		modelRef.value.password.startsWith(value) &&
		modelRef.value.password.length >= value.length
	);
}
const validatePasswordSame=(rule: FormItemRule, value: string): boolean =>{
	return value === modelRef.value.password;
}
const rules: FormRules = {
	username: [
		{
			required: true,
			validator(rule: FormItemRule, value: string) {
				if (!value) {
					return new Error('需要用户名');
				} 
				return true;
			},
			trigger: ['input', 'blur'],
		},
	],
	password: [
		{
			required: true,
			message: '请输入密码',
		},
	],
	reenteredPassword: [
		{
			required: true,
			message: '请再次输入密码',
			trigger: ['input', 'blur'],
		},
		{
			validator: validatePasswordStartWith,
			message: '两次密码输入不一致',
			trigger: 'input',
		},
		{
			validator: validatePasswordSame,
			message: '两次密码输入不一致',
			trigger: ['blur', 'password-input'],
		},
	],
};
// const handlePasswordInput = () => {
// 	if (modelRef.value.reenteredPassword) {
// 		rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
// 	}
// };


const getUserInfo = async () => {
	const res = await userStore.USER_GET(userStore.userInfo.username!)
    if(!res){
        return
    }
	const { code, message, meta, data = {} } = res.data
    imgSrc.value=data.avatar
	Object.assign(modelRef.value, data)
};
const handleUpdate=async ()=>{
	const res = await userStore.USER_SET(modelRef.value)
	const { code, message, meta, data = {} } = res.data
}

onMounted(() => {
	getUserInfo();
});
</script>

<style lang="less" scoped>
// @import '@/views/root.less';
.container{
    height:100%;
    padding: 40px;
    background-color: #f5f5f5;
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}
.card{
    width:70%;
    // width:fit-content;
    max-width:1000px;
    min-width:500px;
    padding: 30px;
    background-color: #fff;
    border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
    display:flex;
    flex-direction: column;
    align-items: center;
}
// :deep(.n-card__content){
//     width:80%;
//     display:flex;
//     flex-direction: column;
//     align-items: center;
// }
.header{
    width:80%;
    // min-width:500px;
    display:flex;
    justify-content: center;
    &-left{
        width:70%;
        text-align: left;
        hr{
            width:50%;
            min-width:286px; 
            color:"#ccc";
        }
    }
}
.content{
    width:80%;
    padding-top:20px;
    display:flex;
    justify-content: center;
    flex-wrap: wrap;
    .form{
    width:80%;
    min-width:286px;
    }
    .n-input{
        max-width: 350px;
    }

}

.n-button {
    min-width:90px;
}
</style>
