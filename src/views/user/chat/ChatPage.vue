<template>
  <div>
    <chat-input-component :conversation-id="props.cid"/>
  </div>
</template>
<script setup lang="ts">
import ChatInputComponent from '@/components/chat/ChatInputComponent.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
interface Props {
  cid: string
}
const props = withDefaults(defineProps<Props>(), {
  cid: () => ''
})

</script>
<style scoped lang="less">

</style>