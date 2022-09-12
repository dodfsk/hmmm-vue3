<template>
	<div class="container">
        <div class="card">

        <div class="header">
            <div class="header-left">
                <h2>个人资料</h2>
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
                    <n-input v-model:value="modelRef.username" @keydown.enter.prevent  disabled />
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
                        placeholder=""
                        @keydown.enter.prevent
                        style="min-width: 50%"
                        autosize
                    />
                </n-form-item>
                <n-form-item path="email" label="邮箱">
                    <n-input
                        v-model:value="modelRef.email"
                        placeholder=""
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-form-item path="birth" label="生日">
                    <n-date-picker
                        v-model:value="modelRef.birth"
                        placeholder=""
                        @keydown.enter.prevent
                    />
                </n-form-item>


            </n-form>
            <div class="content-right">
                
                个人头像
                <n-upload
                    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                    list-type="image-card"
                    @before-upload="beforeUpload"
                >
                    <!-- <n-button>Edit</n-button> -->
                </n-upload>
            </div>

        </div>
        </div>

	</div>
</template>

<script lang="ts" setup>
import { h, ref, Component, reactive, onMounted } from 'vue';
import { FormInst, FormItemInst, FormItemRule, FormRules, NIcon, UploadFileInfo, useMessage } from 'naive-ui';
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon } from '@vicons/ionicons5';
import { demoPiniaOptions, demoPiniaComposition } from '@/store/demo';
import { useUserStore } from '@/store/user';
import { RouterLink } from 'vue-router';
import { User } from '@/types/user';

const inverted = ref(true);

let hmlc_info = ref();
const userStore = useUserStore();

const message = useMessage();

const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const modelRef = ref<User>({});

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

const beforeUpload=async (data: {
        file: UploadFileInfo
        fileList: UploadFileInfo[]
      })=>{
        if (data.file.file?.type !== 'image/png') {
          message.error('只能上传png格式的图片文件，请重新上传')
          return false
        }
        return true
    }

const getUserInfo = async () => {
	const res = await userStore.USER_GET(userStore.userInfo.username!)
	const { code, message, meta, data = {} } = res.data
	hmlc_info.value = data
    if(data.birth){
        data.birth=new Date(data.birth)
    }
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
    padding: 40px;
    background-color:#ccc;
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
	box-shadow: 0 0 10px rgba(51, 51, 51, 0.721);
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
    width:50%;
    min-width:286px;
    }
    .n-input{
        max-width: 80%;
    }
    &-right{
        width:30%;
        display:flex;
        flex-direction: column;
        align-items: start;
    }
}

.n-button {
    min-width:90px;
}
</style>
