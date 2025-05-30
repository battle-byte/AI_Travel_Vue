<template>
  <div id="HomePage">
    <ChatIndexComponent/>
  </div>
</template>



<script setup lang="ts">

import { onMounted, ref } from 'vue'
import ChatIndexComponent from '@/components/chat/ChatIndexComponent.vue'



// 页面加载时请求一次
onMounted(async () => {

})



const pageCount = ref<number>(0)



</script>



<style scoped lang="less">
.search-bar{
  display: flex;
  justify-content: center;     /* 水平居中 */
  align-items: center;         /* 垂直居中 */
  //border: 1px dashed #d9d9d9;  /* 可视化边界 */
}
#HomePage {
}

</style>