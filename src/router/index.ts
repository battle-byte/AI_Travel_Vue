import { createRouter, createWebHistory } from 'vue-router'
import UserIndex from '@/views/user/UserIndex.vue'

import HomePage from '@/views/user/home/HomePage.vue'
import ChatPage from '@/views/user/chat/ChatPage.vue'

// createRouter创建路由实例
// 配置history模式
// 1. history模式：createWebHistory 地址栏不带#
// 2. hash模式：createWebHashHistory
// console.log(import.meta.env.BASE_URL)

// vite中的环境变量 import.meta.env.BASE_URL 就是vite.config.js中的base配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: UserIndex,
      children:[
        { path: '/',
          name: 'home',
          props: true,
          component: HomePage
        },
        { path: '/chat/:cid',
          name: 'chat',
          props: true,
          component: ChatPage
        },
      ]
    },
  ]
})

// 路由守卫 简单的保护页面路由 真正的保护还得靠后台权限校验
// router.beforeEach((to, form, next) => {
//   const user = userStore()
//   // 用户不存在 随意访问
//   if (!user ){
//     next()
//   } else if ((to.name === 'admin') &&  user.user?.rid==2 ){ //用户存在并且访问后台页面
//     next('/login')
//     return
//   }else {
//     // 其他情况不跳转
//     next()
//   }
// })

export default router
