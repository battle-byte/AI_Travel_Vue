// src/stores/conversation.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const conversationStore = defineStore('conversation', () => {
  const refreshTrigger = ref(0)

  const triggerRefresh = () => {
    refreshTrigger.value++
  }

  return {
    refreshTrigger,
    triggerRefresh
  }
})