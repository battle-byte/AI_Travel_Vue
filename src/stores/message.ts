import { defineStore } from 'pinia'
import { ref } from 'vue'
import persist from 'pinia-plugin-persistedstate'
// 控制主页面的左侧导航栏伸缩
export const newMessageStore = defineStore('message', () => {
  //设置token
  const message = ref<string>("")
  const setMessage= (question: string) => {
    message.value = question
  }
  //移除token
  const removeMessage = () => {
    message.value = ""
  }
  return { message, setMessage, removeMessage }
}, {
  persist: false
})