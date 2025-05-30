<template>
  <div class="sidebar-container">
    <!-- 顶部logo和按钮 -->
    <div class="sidebar-header">
      <div class="logo">Cloud Travel</div>
      <el-button class="new-chat-btn" type="primary" round @click="NewChat">开启新对话</el-button>
    </div>
    <!--对话记录-->
    <el-scrollbar class="sidebar-scroll">
      <div
        v-for="(group, groupKey) in groupedConversations"
        :key="groupKey"
        class="conversation-group"
      >
        <div class="group-title">{{ groupKey }}</div>
        <div
          v-for="item in group"
          :key="item.conversationId + item.createdAt"
          @click="$router.replace(`/chat/${item.conversationId}`)"
        >
          <el-tooltip class="box-item" effect="dark" :content="item.title" placement="right-start">
            <div class="conversation-item" :class="{ active: false }">
              <span class="conversation-title">{{ item.title }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </el-scrollbar>
    <!-- 角色图标-->
    <UserCard />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted ,watch} from 'vue'
import dayjs from 'dayjs'
import type { Conversations } from '@/types/ai'
import UserCard from '@/components/user/UserCard.vue'
import { conversationStore, userStore } from '@/stores'
import { ListConversationsAPI } from '@/service/AiController'
import { useRouter } from 'vue-router'

const loginUser = userStore()
const convStore = conversationStore()
const conversation = ref<Conversations[]>([])

// 分组逻辑
const groupedConversations = computed(() => {
  const groups: Record<string, Conversations[]> = {};
  const todayStart = dayjs().startOf('day'); // 今天 00:00:00 作为基准时间

  conversation.value.forEach((item) => {
    const date = dayjs(item.createdAt);
    const dateStart = date.startOf('day'); // 消息日期的 00:00:00
    const diffDay = todayStart.diff(dateStart, 'day')+1; // 计算完整的天数差

    if (diffDay === 0) {
      // 今天（消息日期 >= 今天 00:00:00）
      groups['今天'] = groups['今天'] || [];
      groups['今天'].push(item);
    } else if (diffDay === 1) {
      // 昨天（消息日期 >= 昨天 00:00:00 && < 今天 00:00:00）
      groups['昨天'] = groups['昨天'] || [];
      groups['昨天'].push(item);
    } else if (diffDay <= 7) {
      // 七天内（消息日期 >= 7天前 00:00:00 && < 昨天 00:00:00）
      groups['七天内'] = groups['七天内'] || [];
      groups['七天内'].push(item);
    } else if (diffDay <= 30) {
      // 三十天内（消息日期 >= 30天前 00:00:00 && < 7天前 00:00:00）
      groups['三十天内'] = groups['三十天内'] || [];
      groups['三十天内'].push(item);
    } else {
      // 更早的按年月分组
      const yearMonth = date.format('YYYY年M月');
      groups[yearMonth] = groups[yearMonth] || [];
      groups[yearMonth].push(item);
    }
  });

  // 保证分组顺序：今天 → 昨天 → 七天内 → 三十天内 → 更早的月份（倒序）
  const orderedGroups: Record<string, Conversations[]> = {};

  // 1. 固定顺序的分组
  const fixedGroups = ['今天', '昨天', '七天内', '三十天内'];
  fixedGroups.forEach(key => {
    if (groups[key]) orderedGroups[key] = groups[key];
  });

  // 2. 年月分组按时间倒序（最新的在前）
  Object.keys(groups)
    .filter(key => !fixedGroups.includes(key))
    .sort((a, b) => {
      const dateA = dayjs(a.replace('年', '-').replace('月', ''));
      const dateB = dayjs(b.replace('年', '-').replace('月', ''));
      return dateB.diff(dateA); // 降序排序（最新的在前）
    })
    .forEach(key => {
      orderedGroups[key] = groups[key];
    });

  return orderedGroups;
});

// 获取用户对话记录
const GetUserConversations = async () => {
  if (loginUser.user?.uid && loginUser.user?.uid != '') {
    const res = await ListConversationsAPI(loginUser.user?.uid)
    if (res.code == 0) {
      conversation.value = res.data.conversations
    }
  }
  return
}

const router = useRouter()

const NewChat = () => {
  router.push({
    path:"/"
  })
}

// 监听刷新触发器
watch(() => convStore.refreshTrigger, () => {
  GetUserConversations()
})

onMounted(() => {
  GetUserConversations()
})
</script>

<style lang="less" scoped>
.sidebar-container {
  width: 100%;
  background: #f9fbff;
  border-right: 1px solid #e6eaf2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}


.sidebar-header {
  padding: 32px 0 18px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  color: #222;
  margin-bottom: 8px;
  width: 100%;
  max-width: 220px;
  text-align: center;
  box-sizing: border-box;
  letter-spacing: 2px;
}

.new-chat-btn {
  width: 80%;
  max-width: 200px;
  min-width: 120px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(90deg, #4f8cff 0%, #3ecbff 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  box-shadow: 0 2px 8px 0 rgba(79, 140, 255, 0.08);
  transition: background 0.2s;
  padding: 0 18px;
  letter-spacing: 1px;
  cursor: pointer;
}

.new-chat-btn:hover {
  background: linear-gradient(90deg, #3a7bff 0%, #1ecbff 100%);
}

.sidebar-scroll {
  flex: 1;
  padding: 0 12px 18px 12px;
  min-width: 0;
  overflow: hidden;
}

.conversation-group {
  margin-bottom: 10px;
}

.group-title {
  font-size: 13px;
  color: #b0b8c9;
  margin: 18px 0 8px 10px;
  font-weight: 500;
  letter-spacing: 1px;
}

.conversation-item {
  background: #f4f6fa;
  border-radius: 18px;
  padding: 12px 18px;
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  font-size: 15px;
  color: #222;
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  box-shadow: 0 1px 4px 0 rgba(79, 140, 255, 0.04);
}

.conversation-item:hover,
.conversation-item.active {
  background: #e6eaf2;
  box-shadow: 0 2px 8px 0 rgba(79, 140, 255, 0.1);
}

.conversation-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: #222;
  letter-spacing: 0.5px;
}
</style>
