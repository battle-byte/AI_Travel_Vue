# AI智能体旅行助手
[后端](https://github.com/battle-byte/AI_Travel/tree/master)

## 技术选型
1. vue3
2. Element Plus
3. bytemd markdown展示组件
4. pinia 持久化存储与全局数据共享
## 项目结构
1. components：存放了各种页面组件，包括侧边栏，输入框等
2. request：axios实例，添加了axios的一些基本配置
3. router：路由页面
4. service：接口实例
5. stores: pinia实例
6. types：项目中所使用的数据泛型
7. utils: sse工具，用于快速创建sse实例
8. views: 页面文件

其中项目核心的聊天功能组件位于conponents的chat目录中
