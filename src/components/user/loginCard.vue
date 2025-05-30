<template>
<div>
  <el-dialog v-model="visible" :width="480" class="login-dialog" :close-on-click-modal="false">
    <el-col :span="24" class="form-col" v-if="!isRegister">
      <el-form :rules="rules" :model="formModel" ref="form" size="large" autocomplete="off" class="login-form">
        <el-form-item>
          <h3 class="login-title">Login</h3>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            maxlength="18"
            minlength="5"
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="User Account"
            class="login-input"
            onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="PassWord"
            maxlength="15"
            minlength="6"
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-row">
            <el-input
              v-model="formModel.code"
              style="width: 180px"
              name="code"
              placeholder="Code"
              maxlength="4"
              class="login-input"
            ></el-input>
            <img
              class="captcha-img"
              :src="captchaValue.img"
              @click="getCaptcha"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="loginIn(form)" class="login-btn" type="primary" auto-insert-space>
            登录
          </el-button>
          <el-button
            @click="goToRegister()"
            type="primary"
            link
            class="switch-btn"
          >没有账号？注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" class="form-col" v-if="isRegister">
      <el-form
        :rules="registerRules"
        :model="registerFormModel"
        ref="form"
        size="large"
        autocomplete="off"
        class="login-form"
      >
        <el-form-item>
          <h3 class="login-title">Register</h3>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            maxlength="18"
            minlength="5"
            v-model="registerFormModel.username"
            :prefix-icon="User"
            class="login-input"
            onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
            placeholder="UserName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerFormModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="PassWord"
            maxlength="15"
            minlength="6"
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerFormModel.passwordAgain"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="PassWord Again"
            maxlength="15"
            minlength="6"
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-row">
            <el-input
              v-model="formModel.code"
              style="width: 180px"
              name="code"
              placeholder="Code"
              maxlength="4"
              class="login-input"
            ></el-input>
            <img
              class="captcha-img"
              :src="captchaValue.img"
              @click="getCaptcha"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="registerIn(form)" class="login-btn" type="primary" auto-insert-space>
            注册
          </el-button>
          <el-button @click="goToLogin()" type="primary" link class="switch-btn"
          >已有账号？登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-dialog>
</div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { SysUserLoginRequest, SysUserRegisterRequest } from '@/types/users'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getCaptchaAPI } from '@/service/CaptchaController'
import type { captcha } from '@/types/captcha'

import router from '@/router'
import { userStore } from '@/stores'
import { SysUserLoginAPi, SysUserRegisterAPi } from '@/service/UsersController'



const visible = ref<boolean>(false)

//pinia存储用户信息
const userMessageStore = userStore()

//获取图片和验证码信息
const captchaValue = ref<captcha>({})

const isRegister = ref(false)

//获取验证码
const getCaptcha = async () => {
  // this.codeUrl = 'data:image/gif;base64,' + res.img
  const res = await getCaptchaAPI()
  captchaValue.value.img = res.data.img
  captchaValue.value.uuid = res.data.uuid
}

//登录表单校验
const formModel = ref<SysUserLoginRequest>({
  username: 'qaqbattle',
  password: '123456',
  code: '',
  uuid: ''
})
//表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    {
      min: 5,
      max: 18,
      message: '用户名必须是5-18位',
      trigger: 'change'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}/,
      min: 6,
      max: 15,
      message: '密码必须6-15位'
    }
  ]
}

//登录前的校验
const form = ref< FormInstance>()

//设置登录的请求方法 并在成功获取请求后存储token
const login = async () => {
  const res = await SysUserLoginAPi({
    username: formModel.value.username,
    password: formModel.value.password,
    code: formModel.value.code,
    uuid: captchaValue.value.uuid
  })
  if (res.code === 0) {
    console.log(res.data)
    userMessageStore.setUser(res.data)
    router.push({
      path: '/',
      replace: true
    })
    visible.value = false
  } else {
    getCaptcha()
  }
}

//登录
const loginIn = async (formE: FormInstance | undefined) => {
  if (!formE) return
  await formE.validate((valid: any, fields: any) => {
    if (valid) {
      //提示成功信息
      ElMessage({
        message: '正在验证登录信息',
        type: 'success'
      })
      login()
      //成功开始执行请求登录请求信息 并将信息存储到pinia
    } else {
      ElMessage.error('请合理填写信息！')
    }
  })
}

//注册表单校验
const registerFormModel = ref<SysUserRegisterRequest>({
  username: '',
  password: '',
  passwordAgain: '',
  code: ''
})
//表单校验规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    {
      min: 5,
      max: 18,
      message: '用户名必须是5-18位',
      trigger: 'change'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}/,
      min: 6,
      max: 15,
      message: '密码必须6-15位'
    }
  ],
  passwordAgain: [
    { required: true, message: '请再次输入密码', trigger: 'change' },
    {
      pattern: /^\S{6,15}/,
      min: 6,
      max: 15,
      message: '密码必须6-15位'
    },
    {
      required: registerFormModel.value.passwordAgain == registerFormModel.value.password,
      message: '输入的两次密码不一致！',
      trigger: 'change'
    }
  ]
}

//设置注册的请求方法 并在成功获取请求后存储token
const register = async () => {
  const res = await SysUserRegisterAPi({
    username: registerFormModel.value.username,
    password: registerFormModel.value.password,
    passwordAgain: registerFormModel.value.passwordAgain,
    code: formModel.value.code,
    uuid: captchaValue.value.uuid
  })
  if (res.code === 0) {
    // 注册成功 去登录
    ElMessage.success('注册成功去登陆吧！')
    formModel.value.code = ""
    goToLogin()
  } else {
    // 否则刷新验证码
    getCaptcha()
  }
}

//注册
const registerIn = async (formE:  FormInstance | undefined) => {
  if (!formE) return
  await formE.validate((valid: any, fields: any) => {
    if (valid) {
      //提示成功信息
      ElMessage({
        message: '正在验证注册信息',
        type: 'success'
      })
      register()
      //成功开始执行请求登录请求信息 并将信息存储到pinia
    } else {
      ElMessage.error('请合理填写信息！')
    }
  })
}

/**
 * 点击注册
 */
const goToRegister = () => {
  if (!isRegister.value) {
    isRegister.value = !isRegister.value
    getCaptcha()
  }
}
/**
 * 点击注册
 */
const goToLogin = () => {
  if (isRegister.value) {
    isRegister.value = !isRegister.value
    getCaptcha()
  }
}
const openDialog = ()=>{
  visible.value = true
}
const closeDialog = ()=>{
  visible.value = false
}

defineExpose({
  openDialog,
  closeDialog
})

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="less" scoped>
.login-dialog {
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  .el-dialog__body {
    padding: 32px 36px 24px 36px;
    background: #f7f8fa;
    border-radius: 0 0 24px 24px;
  }
}
.form-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-form {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px 28px 18px 28px;
}
.login-title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 18px;
  color: #222;
}
.login-input {
  font-size: 18px;
  height: 48px;
  border-radius: 10px;
}
.code-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.captcha-img {
  width: 120px;
  height: 40px;
  border-radius: 8px;
  margin-left: 8px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.login-btn {
  width: 100%;
  font-size: 18px;
  height: 48px;
  border-radius: 10px;
  margin-right: 10px;
}
.switch-btn {
  font-size: 15px;
  margin-left: 0;
  color: #409eff;
}
</style>
