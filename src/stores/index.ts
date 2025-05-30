import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(persist)
pinia.use(persist)

export default pinia



import { tabClick } from './tab'
import { userStore } from './user'
import { conversationStore } from './conversation'
import { newMessageStore } from '@/stores/message'

export {tabClick, userStore,conversationStore,newMessageStore }
