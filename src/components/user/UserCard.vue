<template>
  <div class="user-card-outer">
    <view v-if="user && user.user?.token">
      <div class="user-card">
        <el-popover placement="top" :width="180">
          <div style="text-align:center;">
            <el-button size="small" type="danger" plain @click="loginOut">
              退出登录
            </el-button>
          </div>
          <template #reference>
            <el-icon class="user-avatar"><UserFilled /></el-icon>
          </template>
        </el-popover>
        <div class="user-info">
          <div class="user-nickname">{{ user.user?.username  }}</div>
        </div>
      </div>
    </view>
    <view v-else>
      <div class="user-card user-card-guest">
        <el-button type="primary" text class="login-btn" @click="openLoginCard">登录享受服务</el-button>
      </div>
    </view>
  </div>
  <login-card ref="loginCard"/>
</template>
<script setup lang="ts">
import { userStore } from '@/stores'
import {
  UserFilled
} from '@element-plus/icons-vue'
import LoginCard from '@/components/user/loginCard.vue'
import { ref } from 'vue'
const user = userStore()
const loginCard = ref()
const openLoginCard = ()=>{
  loginCard.value.openDialog()
}
const loginOut = ()=>{
  user.removeUser()
}

</script>
<style scoped lang="less">
.user-card-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.user-card {
  display: flex;
  align-items: center;
  background: #f7f8fa;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 12px 20px;
  margin: 16px 0;
  min-width: 180px;
  min-height: 48px;
}
.user-card-guest {
  justify-content: center;
  width: 100%;
}
.user-avatar {
  font-size: 32px;
  color: #409eff;
  margin-right: 12px;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.user-nickname {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}
.login-btn {
  font-size: 15px;
  margin-left: 8px;
  font-weight: 500;
}
</style>