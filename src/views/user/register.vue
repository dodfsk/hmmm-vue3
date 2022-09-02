<template>
	<div class="container">
		<div class="box">
			<n-card class="n-card-login" title="注册面板">
				<n-form ref="formRef" :model="userState" :rules="rules">
					<n-form-item label="账号:" path="username">
						<n-input
							v-model:value="userState.username"
							placeholder="填写你的用户名"
                            @keyup.enter="validateAction"
						/>
					</n-form-item>
					<n-form-item label="密码:" path="password">
						<n-input
							v-model:value="userState.password"
							type="password"
							show-password-on="click"
							placeholder="请输入密码"
                            @keyup.enter="validateAction"
						>
                            <template #password-visible-icon>
                                <n-icon :size="16" :component="GlassesOutline" />
                            </template>
                            <template #password-invisible-icon>
                                <n-icon :size="16" :component="Glasses" />
                            </template>
                        </n-input>
                        
					</n-form-item>
					<n-form-item label="确认密码:" path="second" first>
						<n-input
							v-model:value="userState.second"
                            :disabled="!userState.password"
							type="password"
							show-password-on="click"
							placeholder="请和密码保持一致"
                            @keyup.enter="validateAction"
						>
                        <template #password-visible-icon>
                                <n-icon :size="16" :component="GlassesOutline" />
                            </template>
                            <template #password-invisible-icon>
                                <n-icon :size="16" :component="Glasses" />
                            </template>
                        </n-input>
					</n-form-item>

					<n-space justify="space-evenly">
						<n-button type="primary" @click="validateAction">
							确定
						</n-button>

                        <n-button  @click="handleBack">
							返回
						</n-button>

					</n-space>

				</n-form>
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { reactive, toRefs,ref } from "vue";
import { useRouter } from "vue-router";
import { GlassesOutline, Glasses } from '@vicons/ionicons5'
// import { register } from "@/api/user/demo"
import {useUserStore} from "@/store/user"
import {
    FormItemRule,
    FormRules,
    FormInst,
} from 'naive-ui'

const router = useRouter();
const { USER_REG }=useUserStore()

interface userType {
    username: string | null;
    password: string | null;
    second?: string | null;
}

const userState = reactive<userType>({
		username: null,
		password: null,
		second: null,
});
// let { name, password } = toRefs(userState);

const formRef = ref<FormInst | null>(null)

function validatePasswordStartWith (
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!userState.password &&
        userState.password.startsWith(value) &&
        userState.password.length >= value.length
      )
    }
    function validatePasswordSame (rule: FormItemRule, value: string): boolean {
      return value === userState.password
    }
const rules: FormRules = {
    //   age: [
    //     {
    //       required: true,
    //       validator (rule: FormItemRule, value: string) {
    //         if (!value) {
    //           return new Error('需要年龄')
    //         } else if (!/^\d*$/.test(value)) {
    //           return new Error('年龄应该为整数')
    //         } else if (Number(value) < 18) {
    //           return new Error('年龄应该超过十八岁')
    //         }
    //         return true
    //       },
    //       trigger: ['input', 'blur']
    //     }
    //   ],
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: ['input', 'blur']
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: ['input', 'blur']
        }
      ],
      second: [
        {
          required: true,
          message: '请再次输入密码',
          trigger: ['input', 'blur']
        },
        {
          validator: validatePasswordStartWith,
          message: '两次密码输入不一致',
          trigger: 'input'
        },
        {
          validator: validatePasswordSame,
          message: '两次密码输入不一致',
          trigger: ['blur', 'password-input']
        }
      ]
}

const validateAction=()=>{
    formRef.value?.validate((errors) => {
        if(!errors){
            handleRegister()
        }
    })
}

const handleRegister = _.throttle(async() => {
    const params=_.pick(userState, ['username', 'password']);
    const res=await USER_REG(params)
    const { code, message } = res.data

    if(code==200){
        window.$notification.success({
            title:'success',
            content:message||'注册成功!',
            meta:`${userState.username},欢迎`,
            duration: 3000,
        })
        router.push({
            path: "/user/info",
        });
    }
    
    },
    800,{
    // leading:true,
    trailing: false
    }
);
const handleBack=()=>{
    router.push({
        path: "/user/login",
    });
}
</script>

<style lang="less" scoped>
@import '@/views/root.less';
.container {
	height: 100%;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
}
.box {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 400px;
	height: 450px;
    min-width: 400px;
	min-height: 450px;
	// background-color: rgba(87, 213, 91, 0.6);
	border-radius: 5px;
	box-shadow: 0 0 10px rgba(51, 51, 51, 0.721);

    background: -webkit-linear-gradient(135deg,rgba(87, 213, 91, 0.6), rgba(140, 0, 255, 0.6)); /* Safari 5.1 - 6.0 */

    background: -o-linear-gradient(135deg,rgba(87, 213, 91, 0.6), rgba(140, 0, 255, 0.6)); /* Opera 11.1 - 12.0 */

    background: -moz-linear-gradient(135deg,rgba(87, 213, 91, 0.6), rgba(140, 0, 255, 0.6)); /* Firefox 3.6 - 15 */

    background: linear-gradient(135deg,rgba(87, 213, 91, 0.6), rgba(140, 0, 255, 0.6)); /* 标准的语法（必须放在最后） */
}
.n-card {
	&-login {
		width: 350px;
		height: 400px;
        min-width: 350px;
	    min-height: 400px;
		border-radius: 5px;
	}
}

.n-button {
	width: 90px;
}
</style>
