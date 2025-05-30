<template>
  <div style="height: 100%">
    <div class="conversation-header">
      {{ ConversationMessage.title || '新对话' }}
    </div>
    <div class="chat-input-container">
      <div class="chat-history">
        <div
          v-for="msg in ChatHistory"
          :key="msg.messageId"
          :class="['chat-bubble', msg.senderType === AI_SENDER_TYPE.USER ? 'user' : 'system']"
        >
          <template v-if="msg.senderType === AI_SENDER_TYPE.USER">
            <div class="user-content">{{ msg.content }}</div>
          </template>
          <template v-else>
            <Viewer :value="msg.content" />
          </template>
        </div>
      </div>



      <div class="chat-input-wrapper">
        <el-input
          v-model="ChatMessage"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          :placeholder="'给 小V 发送消息，指定你的出行计划把！'"
          class="chat-input-box"
        />
        <el-button :disabled="ChatMessage.length==0" :icon="Finished" class="send-btn" @click="StartChat" />
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import { AI_SENDER_TYPE, type Conversations, type Messages, type NewChatRequest } from '@/types/ai'
import { GetConversationsAPI, ListMessagesByConversationAPI } from '@/service/AiController'
import { Viewer } from '@bytemd/vue-next'
import { useRoute } from 'vue-router'
import { SSEService } from '@/utils/SseUtils'
import { conversationStore, newMessageStore, userStore } from '@/stores'

interface Props {
  conversationId?: string
}

const props = defineProps<Props>()

const ChatMessage = ref<string>('')
const loginUser = userStore()
const route = useRoute()
const conversationFlush = conversationStore()
const newChatQuestion = newMessageStore()
const ChatHistory = ref<Messages[]>([])
const ConversationMessage = ref<Conversations>({ conversationId: '', createdAt: '', title: '', userId: '' })


const NewChatRequest = ref<NewChatRequest>({ conversion_id: props.conversationId!, question: '', uid: loginUser.user?.uid! })
let sse = new SSEService()

const StartChat = () => {
  ChatHistory.value.push({
    messageId: Date.now().toString(),
    senderType: AI_SENDER_TYPE.USER,
    content: ChatMessage.value,
    createdAt: new Date().toISOString(),
    conversationId: props.conversationId!
  })
  GetChatMessage()
}
const GetChatMessage = () => {
  // 1. 保存用户消息
  NewChatRequest.value.question = ChatMessage.value;
  ChatMessage.value = ""; // 清空输入框

  // 2. 预先添加一个空的 AI 消息到聊天历史（作为占位）
  const aiMessageId = Date.now().toString() + '-ai'; // 生成唯一 ID
  ChatHistory.value.push({
    messageId: aiMessageId,
    senderType: AI_SENDER_TYPE.SYSTEM, // 标记为 AI 消息
    content: '', // 初始为空，后续逐步追加
    createdAt: new Date().toISOString(),
    conversationId: props.conversationId!
  });

  // 3. 建立 SSE 连接
  sse.connect('http://127.0.0.1:8101/gin/chat/sse', 'POST', NewChatRequest.value, (event: any) => {
    if (event.data === 'StreamCompleted') {
      // 流式传输结束 等待三秒后我们 刷新标题与会话列表
      setTimeout(() => {
        GetConversationMessage()
        conversationFlush.triggerRefresh()
      }, 3000)
    } else {
      // 逐步更新 AI 消息内容
      const aiMessage = ChatHistory.value.find(msg => msg.messageId === aiMessageId);
      if (aiMessage) {
        aiMessage.content += event.data; // 追加新内容
        // 触发响应式更新（Vue 3 需要替换引用）
        ChatHistory.value = [...ChatHistory.value];
      }
    }
  });
}

const ListMessage = async () => {
  if (!props.conversationId || props.conversationId == '') {
    return
  }
  const res = await ListMessagesByConversationAPI(props.conversationId)
  if (res.code == 0) {
    ChatHistory.value = res.data.messages
  }
}
const GetConversationMessage = async ()=>{
  if (!props.conversationId || props.conversationId == '') {
    return
  }
  const res = await GetConversationsAPI(props.conversationId!)
  if (res.code == 0) {
    ConversationMessage.value = res.data.conversations
  }
}

// 在组件挂载后，获取聊天记录
onMounted(() => {
  ListMessage()
  GetConversationMessage()
  if (newChatQuestion.message && newChatQuestion.message != '') {
    ChatMessage.value = newChatQuestion.message
    newChatQuestion.removeMessage() // 清空消息
    GetChatMessage()
  }
})

// 监听路由中的 conversationId 变化，以便在切换会话时更新聊天记录
watch(
  () => props.conversationId,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      ListMessage()
      GetChatMessage()
      GetConversationMessage()
    }
  }
)
</script>
<style scoped lang="less">
/* 新增外层容器（仅控制宽度） */

.chat-input-container {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.conversation-header {
  position: sticky;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  border-bottom: 1px solid #f0f0f0;
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
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.06);
  padding: 28px 36px;
  width: 100%;
  max-width: 720px;
  margin-top: 0;
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 100;
}

.chat-input-box {
  flex: 1;
  margin-right: 16px;
  background: #fff;
  border-radius: 18px;
  min-height: 54px;
  font-size: 22px;
  border: 1.5px solid #d0d7de;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 24px;
  transition:
    box-shadow 0.2s,
    border 0.2s;
}

.chat-input-box:focus-within {
  box-shadow:
    0 0 0 2px #409eff,
    0 4px 16px rgba(64, 158, 255, 0.1);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 28px;
  border: none;
  transition:
    background 0.2s,
    box-shadow 0.2s,
    transform 0.1s;
  margin-left: 0;
  cursor: pointer;

  &:hover {
    background: #e6f0ff;
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.16);
    transform: translateY(-2px) scale(1.05);
  }
}

.chat-history {
  width: 100%;
  margin-bottom: 20px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 200px;
}

.chat-bubble {
  max-width: 70%;
  min-width: 80px;
  width: fit-content;
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 18px;
  word-break: break-word;
  white-space: pre-line;
  overflow-wrap: break-word;
  box-sizing: border-box;
  text-align: left;
}

.chat-bubble.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #d2f9d1 0%, #e8ffe8 100%);
  color: #222;
  text-align: left;
}

.chat-bubble.system {
  align-self: flex-start;
  background: linear-gradient(135deg, #f0f4ff 0%, #e3e9f7 100%);
  color: #333;
  text-align: left;
}
</style>
