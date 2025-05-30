<template>
  <div class="chat-index-container">
    <div class="chat-hint-title">
      我是小V,您的旅行小助手!
    </div>
    <div class="chat-hint-desc">
      我可以帮你规划旅行路线，推荐景点，提供旅行建议，请把你的任务交给我吧
    </div>
    <div class="chat-input-wrapper">
      <el-input
        v-model="ChatMessage"
        type="textarea"
       :autosize="{ minRows: 2, maxRows: 5 }"
        :placeholder="'给 CloudTravel 发送消息，指定你的出行计划把！'"
        class="chat-input-box"
      />
      <el-button :disabled="ChatMessage.length==0" @click="GoChat" :icon="Finished" class="send-btn" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  Finished
} from '@element-plus/icons-vue'

import { GenerateOnlyIdAPI } from '@/service/GenerateOnlyId'
import { conversationStore, newMessageStore, userStore } from '@/stores'
import { CreateConversationsAPI, GetConversationsAPI } from '@/service/AiController'
import type { Conversations } from '@/types/ai'
import { ElMessage } from 'element-plus'
const convStore = conversationStore()
import { useRouter } from 'vue-router'
const loginUser = userStore()

const ChatMessage = ref<string>('')

const NewConversationId = ref<string>('')
const NewConversation = ref<Conversations>({
  conversationId: '', createdAt: '', title: '', userId: ''
})
const GetSnowId = async ()=>{
  const res = await GenerateOnlyIdAPI()
  if (res.code === 0){
    NewConversationId.value = res.data.id
  }
}
const CreateConversation = async ()=>{
  const res = await CreateConversationsAPI({
    question:"",
    uid:loginUser.user?.uid!,
    conversionId:NewConversationId.value,
  })
  if (res.code === 0){
    GetConversation()
  }
}

const GetConversation = async ()=>{
  const res = await GetConversationsAPI(NewConversationId.value)
  if (res.code === 0){
    NewConversation.value = res.data
  }
}

const route = useRouter()
const chatMessage = newMessageStore()
const GoChat = async ()=>{
  if(loginUser && loginUser.user?.uid!=""){
    await GetSnowId()
    await CreateConversation()
    convStore.triggerRefresh()
    chatMessage.setMessage(ChatMessage.value)
    route.push({
      path: `/chat/${NewConversationId.value}`
    })
  }else {
    ElMessage.error("您还未登录 点击左下角登录吧")
  }
}
</script>
<style scoped lang="less">
.chat-index-container {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.chat-hint-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-logo {
  font-size: 28px;
  margin-right: 8px;
}
.chat-hint-desc {
  font-size: 18px;
  color: #666;
  margin-bottom: 48px;
}
.chat-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eceff3;
  border-radius: 28px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06);
  padding: 28px 36px;
  width: 100%;
  max-width: 720px;
  margin-top: 0;
}
.chat-input-box {
  flex: 1;
  margin-right: 16px;
  background: #fff;
  border-radius: 18px;
  min-height: 54px;
  font-size: 22px;
  border: 1.5px solid #d0d7de;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 24px;
  transition: box-shadow 0.2s, border 0.2s;
}
.chat-input-box:focus-within {
  box-shadow: 0 0 0 2px #409eff, 0 4px 16px rgba(64,158,255,0.10);
  border: 1.5px solid #409eff;
}
.send-btn {
  background: #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  font-size: 28px;
  border: none;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  margin-left: 0;
  cursor: pointer;
  &:hover {
    background: #e6f0ff;
    box-shadow: 0 4px 16px rgba(64,158,255,0.16);
    transform: translateY(-2px) scale(1.05);
  }
}
</style>
